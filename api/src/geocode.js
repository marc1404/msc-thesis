import googleMaps from '@google/maps';

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
const googleMapsClient = googleMaps.createClient({
    key: googleMapsApiKey,
    Promise: Promise
});

export default async function geocode(address) {
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
