import { connect } from '../../beer-scraper/src/mysql';
import googleMaps from '@google/maps';

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
const googleMapsClient = googleMaps.createClient({
    key: googleMapsApiKey,
    Promise: Promise
});

export default async function places(request) {
    const db = await connect();
    const { id } = request.params;
    const places = await loadPlaces(id, db);

    await enrichLocations(places, db);
    await db.close();

    return places;
}

async function loadPlaces(id, db) {
    const { rows } = await db`
        SELECT places.id, name, type, street, locality, region, country, postal_code, rating_count, rating_value, facebook_url, twitter_url, website_url, telephone, opening_times, image_url, latitude, longitude
        FROM places
        INNER JOIN beer_places
        ON places.id = beer_places.place_id AND beer_places.beer_id = ${id};
    `;

    return rows;
}

async function enrichLocations(places, db) {
    const relevantPlaces = places.filter(place => place.latitude === null || place.longitude === null);
    const tasks = relevantPlaces.map(place => enrichLocation(place, db));

    await Promise.all(tasks);
}

async function enrichLocation(place, db) {
    const address = getAddress(place);
    const location = await geocode(address);

    if (!location) {
        return;
    }

    const { latitude, longitude } = location;
    place.latitude = latitude;
    place.longitude = longitude;

    await db`UPDATE places SET latitude = ${latitude}, longitude = ${longitude} WHERE id = ${place.id} LIMIT 1;`;
}

function getAddress(place) {
    const addressParts = [
        place.street,
        place.locality,
        place.region,
        place.country
    ].filter(part => part !== undefined && part !== null && part !== '');

    return addressParts.join(', ');
}

async function geocode(address) {
    try {
        const response = await googleMapsClient.geocode({
            address: address
        }).asPromise();
        const [result] = response.json.results;
        const { location } = result.geometry;

        return {
            latitude: location.lat,
            longitude: location.lng
        };
    } catch (error) {
        console.error(error);
    }

    return null;
}

