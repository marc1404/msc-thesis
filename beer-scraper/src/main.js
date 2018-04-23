import fs from 'fs';
import pLimit from 'p-limit';
import { extractBeer, extractReviews } from './extract';
import { insertBeer, insertReviews } from './insert';
import { connect } from './mysql';
import scrape from './scrape';
import prompts from 'prompts';
import consola from 'consola';
import getBeers from './getBeers';

const concurrency = 100;
const progress = {
    current: 0,
    total: 0
};
const taskFunctions = {
    beers: {
        extract: extractBeer,
        insert: insertBeer
    },
    reviews: {
        extract: extractReviews,
        insert: insertReviews
    }
};

(async () => {
    const { scrapeTarget, scrapeAmount } = await prompts([
        {
            type: 'select',
            name: 'scrapeTarget',
            message: 'What should be scraped?',
            choices: [
                { title: 'Beers 🍺', value: 'beers' },
                { title: 'Reviews ⭐', value: 'reviews' }
            ]
        },
        {
            type: 'number',
            name: 'scrapeAmount',
            message: 'How many? (0 = all)',
            initial: 0,
            min: 0
        }
    ]);

    consola.start('Connecting to MySQL database...');

    const db = await connect();

    consola.success('Connected to MySQL database');

    const { extract, insert } = taskFunctions[scrapeTarget];
    const allBeers = getBeers();
    const sliceEnd = scrapeAmount === 0 ? allBeers.length : scrapeAmount;
    const beers = allBeers.slice(0, sliceEnd);
    const limit = pLimit(concurrency);
    progress.total = beers.length;

    const tasks = beers.map(beer => {
        return limit(() => scrapeBeerUrl(beer, extract, insert, db));
    });

    consola.info(`Found ${allBeers.length} beers, using ${beers.length}`);
    consola.info(`Using concurrency of ${concurrency}`);
    logProgress(false);

    const result = await Promise.all(tasks);

    consola.success('Done!');
    consola.start('Dumping result...');

    const outputFile = `../output/${scrapeTarget}_${new Date().toISOString()}.json`;
    const outputContent = JSON.stringify(result, null, 2);

    fs.writeFileSync(outputFile, outputContent, { encoding: 'utf8' });
    consola.success('Output saved to disk!');
    await db.close();
})().catch(error => consola.error(error));

async function scrapeBeerUrl(url, extract, insert, db) {
    try {
        const $ = await scrape(url);

        return await extract(url, $, insert, db);
    } catch (error) {
        consola.error(`Error while scraping ${url}!`);
        consola.error(error);
    } finally {
        logProgress();
    }

    return null;
}

function logProgress(increment = true) {
    if (increment) {
        progress.current++;
    }

    consola.info(`Progress ${progress.current}/${progress.total}`);
}