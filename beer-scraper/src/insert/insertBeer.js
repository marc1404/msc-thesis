export default async function insertBeer(beer, db) {
    const { brewery, tags, style } = beer;

    await Promise.all([
        insertBrewery(brewery, db),
        insertTags(tags, db),
        insertStyle(style, db),
        insertOnlyBeer(beer, db)
    ]);

    await insertBeerTagsRelation(beer, db);
};

async function insertBrewery(brewery, db) {
    if (!brewery.name) {
        return Promise.resolve();
    }

    return db`
        INSERT IGNORE INTO breweries (id, name, url) VALUES (
            ${brewery.id},
            ${brewery.name},
            ${brewery.url}
        );
    `;
}

async function insertTags(tags, db) {
    const tasks = [];

    tags.forEach(tag => {
        const task = db`
            INSERT IGNORE INTO tags (name) VALUES (${tag});
        `;

        tasks.push(task);
    });

    await Promise.all(tasks);
}

async function insertStyle(style, db) {
    if (!style || !style.name) {
        return Promise.resolve();
    }

    const { id, name, url } = style;

    return db`
        INSERT IGNORE INTO beer_styles (id, name, url) VALUES (${id}, ${name}, ${url});
    `;
}

async function insertOnlyBeer(beer, db) {
    const { id, name, brewery, style, url, location, image, description, ratings, stats } = beer;
    const { overall: overallRating, style: styleRating, weightedAverage, count } = ratings;
    const { ibu, calories, abv } = stats;

    if (!name) {
        return Promise.resolve();
    }

    return db`
        INSERT IGNORE INTO beers (
            id, name, brewery_id, style_id, url, location, image, description, overall, style, weighted_average, total_ratings, ibu, calories, abv
        ) VALUES (
            ${id}, ${name}, ${brewery.id}, ${style.id}, ${url}, ${location}, ${image}, ${description}, ${overallRating}, ${styleRating}, ${weightedAverage}, ${count}, ${ibu}, ${calories}, ${abv}
        );
    `;
}

async function insertBeerTagsRelation(beer, db) {
    const { rows } = await db`SELECT id, name FROM tags;`;
    const tagMap = new Map();

    for (const row of rows) {
        tagMap.set(row.name, row.id);
    }

    const tasks = beer.tags.map(tag => {
        const tagId = tagMap.get(tag);

        if (!tagId) {
            return Promise.resolve();
        }

        return db`
            INSERT IGNORE INTO beer_tags (beer_id, tag_id) VALUES (${beer.id}, ${tagId});
        `;
    });

    await Promise.all(tasks);
}