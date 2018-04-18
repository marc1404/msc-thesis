import mysqlConfig from './mysqlConfig';
import { connect } from '@rich_harris/sql';
import scrapedBeers from '../../beer-scraper/output/scrapedBeers.json';
import scrape from "../../beer-scraper/src/scrape";

export default async function importBeers() {
    const config = Object.assign({ connectionLimit: 100 }, mysqlConfig);
    const db = await connect(config);

    await Promise.all([
        insertBreweries(db),
        insertTags(db),
        insertStyles(db)
    ]);

    await Promise.all([
        insertBeers(db),
        insertBeerTagsRelation(db)
    ]);

    await db.close();
}

async function insertBreweries(db) {
    const breweries = scrapedBeers.map(beer => beer.brewery);
    const tasks = breweries.map(brewery => {
        if (!brewery.name) {
            return;
        }

        brewery.url = brewery.url.replace('com//', 'com/');

        return db`
            INSERT IGNORE INTO breweries (id, name, url) VALUES (
                ${brewery.id},
                ${brewery.name},
                ${brewery.url}
            );
        `;
    });

    await Promise.all(tasks);
}

async function insertTags(db) {
    const tagSet = new Set();

    for (const beer of scrapedBeers) {
        for (const tag of beer.tags) {
            if (!tag) {
                continue;
            }

            tagSet.add(tag);
        }
    }

    const tasks = [];

    tagSet.forEach(tag => {
        const task = db`
            INSERT IGNORE INTO tags (name) VALUES (${tag});
        `;

        tasks.push(task);
    });

    await Promise.all(tasks);
}

async function insertStyles(db) {
    const styleSet = new Set();

    for (const beer of scrapedBeers) {
        const { style } = beer;

        if (!style) {
            continue;
        }

        styleSet.add(style);
    }

    const tasks = [];

    styleSet.forEach(style => {
        const task = db`
            INSERT IGNORE INTO beer_styles (name) VALUES (${style});
        `;

        tasks.push(task);
    });

    await Promise.all(tasks);
}

async function insertBeers(db) {
    const { rows } = await db`SELECT id, name FROM beer_styles;`;
    const styleMap = new Map();

    for (const row of rows) {
        styleMap.set(row.name, row.id);
    }

    const tasks = scrapedBeers.map(beer => {
        const { id, name, brewery, style, url, location, image, description, ratings, stats } = beer;
        const { overall: overallRating, style: styleRating, weightedAverage, count } = ratings;
        const { ibu, calories, abv } = stats;
        const styleId = styleMap.get(style) || null;

        if (!name) {
            return Promise.resolve();
        }

        return db`
            INSERT IGNORE INTO beers (
                id, name, brewery_id, style_id, url, location, image, description, overall, style, weighted_average, total_ratings, ibu, calories, abv
            ) VALUES (
                ${id}, ${name}, ${brewery.id}, ${styleId}, ${url}, ${location}, ${image}, ${description}, ${overallRating}, ${styleRating}, ${weightedAverage}, ${count}, ${ibu}, ${calories}, ${abv}
            );
        `;
    });

    await Promise.all(tasks);
}

async function insertBeerTagsRelation(db) {
    const { rows } = await db`SELECT id, name FROM tags;`;
    const tagMap = new Map();

    for (const row of rows) {
        tagMap.set(row.name, row.id);
    }

    const relations = [];

    for (const beer of scrapedBeers) {
        for (const tag of beer.tags) {
            const tagId = tagMap.get(tag);

            if (!tagId) {
                continue;
            }

            relations.push({
                beerId: beer.id,
                tagId: tagId
            });
        }
    }

    const tasks = relations.map(({ beerId, tagId }) => {
        return db`
            INSERT IGNORE INTO beer_tags (beer_id, tag_id) VALUES (${beerId}, ${tagId});
        `;
    });

    await Promise.all(tasks);
}