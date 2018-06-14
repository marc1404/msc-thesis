import { connect } from '../../beer-scraper/src/mysql';
import firstRow from './firstRow';

export default async function beer(request) {
    const db = await connect();
    const { id } = request.params;

    const [beer, tags] = await Promise.all([
        loadBeer(id, db),
        loadTags(id, db)
    ]);

    const [style, brewery] = await Promise.all([
        loadStyle(beer.style_id, db),
        loadBrewery(beer.brewery_id, db)
    ]);

    await db.close();

    return {
        name: beer.name,
        location: beer.location,
        image: beer.image,
        description: beer.description,
        overall: beer.overall,
        average: beer.weighted_average,
        ratings: beer.total_ratings,
        ibu: beer.ibu,
        calories: beer.calories,
        abv: beer.abv,
        style: style.name,
        brewery: brewery.name,
        tags: tags
    };
}

async function loadBeer(id, db) {
    const { rows } = await db`SELECT name, brewery_id, style_id, location, image, description, overall, style, weighted_average, total_ratings, ibu, calories, abv FROM beers WHERE id = ${id} LIMIT 1;`;

    return firstRow(rows);
}

async function loadStyle(id, db) {
    const { rows } = await db`SELECT name FROM beer_styles WHERE id = ${id} LIMIT 1;`;

    return firstRow(rows);
}

async function loadBrewery(id, db) {
    const { rows } = await db`SELECT name FROM breweries WHERE id = ${id} LIMIT 1;`;

    return firstRow(rows);
}

async function loadTags(id, db) {
    const { rows } = await db`SELECT tag_id FROM beer_tags WHERE beer_id = ${id};`;
    const tagIds = rows.map(row => row.tag_id);

    const tasks = tagIds.map(tagId => {
        return db`SELECT name FROM tags WHERE id = ${tagId} LIMIT 1;`;
    });

    const results = await Promise.all(tasks);

    return results.map(result => firstRow(result.rows).name);
}
