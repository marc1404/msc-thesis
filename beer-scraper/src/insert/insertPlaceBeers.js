export default async function insertPlaceBeers(placeBeers, db) {
    const tasks = placeBeers.map(({ placeId, beerId }) => {
        return db`INSERT IGNORE INTO beer_places (place_id, beer_id) VALUES (${placeId}, ${beerId});`;
    });

    await Promise.all(tasks);
};