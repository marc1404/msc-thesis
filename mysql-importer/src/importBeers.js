import mysqlConfig from './mysqlConfig';
import { connect } from '@rich_harris/sql';
import scrapedBeers from '../../beer-scraper/output/scrapedBeers.json';

export default async function importBeers() {
    const config = Object.assign({ connectionLimit: 100 }, mysqlConfig);
    const db = await connect(config);

    await insertBreweries(db);
    await db.close();
}

async function insertBreweries(db) {
    const breweries = scrapedBeers.map(beer => beer.brewery);
    const tasks = breweries.map(brewery => {
        if (!brewery.name) {
            return;
        }

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