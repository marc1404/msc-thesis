import mysqlConfig from './mysqlConfig';
import { connect } from '@rich_harris/sql';
import scrapedBeers from '../../beer-scraper/output/scrapedBeers.json';

export default async function importBeers() {
    const config = Object.assign({ connectionLimit: 100 }, mysqlConfig);
    const db = await connect(config);

    await Promise.all([
        insertBreweries(db),
        insertTags(db),
        insertStyles(db)
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