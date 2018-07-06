import { connect } from '../../beer-scraper/src/mysql';
import firstRow from './firstRow';
import castToAverageRating from './castToAverageRating';

export default async function beer(request) {
    const db = await connect();
    const { id } = request.params;

    const [beer, tags, averageRating] = await Promise.all([
        loadBeer(id, db),
        loadTags(id, db),
        loadAverageRating(id, db)
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
        rating: {
            overall: beer.overall,
            style: beer.style
        },
        average: beer.weighted_average,
        averageRating: averageRating,
        ratings: beer.total_ratings,
        ibu: beer.ibu,
        calories: beer.calories,
        abv: beer.abv,
        style: style,
        brewery: brewery.name,
        tags: tags
    };
}

async function loadBeer(id, db) {
    const { rows } = await db`SELECT name, brewery_id, style_id, location, image, description, overall, style, weighted_average, total_ratings, ibu, calories, abv FROM beers WHERE id = ${id} LIMIT 1;`;

    return firstRow(rows);
}

async function loadStyle(id, db) {
    const { rows } = await db`SELECT name, url FROM beer_styles WHERE id = ${id} LIMIT 1;`;

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

async function loadAverageRating(id, db) {
    const { rows } = await db`
        SELECT AVG(aroma) AS aroma, AVG(appearance) AS appearance, AVG(taste) AS taste, AVG(palate) as palate, AVG(overall) as overall
        FROM reviews
        WHERE beer_id = ${id};
    `;
    const row = firstRow(rows);

    return castToAverageRating(row);
}
