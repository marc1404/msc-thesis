import { connect } from '../../beer-scraper/src/mysql';
import geocode from './geocode';

export default async function userLocation(request) {
    const { id } = request.params;
    const db = await connect();
    const locations = await loadLocations(id, db);

    await db.close();

    return locations;
}

async function loadLocations(id, db) {
    const { rows } = await db`
        SELECT beers.id, beers.location, beers.latitude, beers.longitude
        FROM beers
        INNER JOIN reviews
        ON beers.id = reviews.beer_id AND reviews.user_id = ${id};
    `;

    await enrichLocations(rows, db);

    return rows.map(row => ({
        latitude: row.latitude,
        longitude: row.longitude
    }));
}

async function enrichLocations(beers, db) {
    const relevantBeers = beers.filter(beer => beer.latitude === null || beer.longitude === null);
    const tasks = relevantBeers.map(beer => enrichLocation(beer, db));

    await Promise.all(tasks);
}

async function enrichLocation(beer, db) {
    const location = await geocode(beer.location);

    if (!location) {
        return;
    }

    const { latitude, longitude } = location;
    beer.latitude = location.latitude;
    beer.longitude = location.longitude;

    await db`UPDATE beers SET latitude = ${latitude}, longitude = ${longitude} WHERE id = ${beer.id} LIMIT 1;`;
}
