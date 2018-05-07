import fs from 'fs';
import pLimit from 'p-limit';
import { extractBeer, extractReviews, queryBeer } from './extract';
import { insertBeer, insertReviews } from './insert';
import { shouldSkipBeer, shouldSkipReviews } from './skip';
import { connect } from './mysql';
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
        insert: insertBeer,
        shouldSkip: shouldSkipBeer
    },
    reviews: {
        extract: extractReviews,
        insert: insertReviews,
        shouldSkip: shouldSkipReviews
    },
    beersGraphQL: {
        extract: queryBeer,
        insert: insertBeer,
        shouldSkip: shouldSkipBeer
    }
};

(async () => {
    const { scrapeFile, scrapeTarget, scrapeAmount } = await prompts([
        {
            type: 'select',
            name: 'scrapeFile',
            message: 'Which scraping list?',
            choices: [
                { title: 'World 🌍', value: '../data/beers.txt' },
                { title: 'The Netherlands 🇳🇱', value: '../data/beers_NL.txt' }
            ]
        },
        {
            type: 'select',
            name: 'scrapeTarget',
            message: 'What should be scraped?',
            choices: [
                { title: 'Beers 🍺', value: 'beers' },
                { title: 'Reviews ⭐', value: 'reviews' },
                { title: 'Beers GraphQL 🍺', value: 'beersGraphQL' },
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

    const { extract, insert, shouldSkip } = taskFunctions[scrapeTarget];

    await shouldSkip.init(db);

    const allBeers = getBeers(scrapeFile);
    const sliceEnd = scrapeAmount === 0 ? allBeers.length : scrapeAmount;
    const beers = allBeers
        .slice(0, sliceEnd)
        .filter(beer => shouldSkip.check(beer));

    const limit = pLimit(concurrency);
    progress.total = beers.length;

    consola.info(`Found ${allBeers.length} beers, skipped ${shouldSkip.skipped}, using ${beers.length}`);
    consola.info(`Using concurrency of ${concurrency}`);
    logProgress(false);

    const tasks = beers.map(beer => {
        return limit(() => runTask(beer, extract, insert, db));
    });

    const result = await Promise.all(tasks);

    consola.success('Done!');
    consola.start('Dumping result...');

    const outputFile = `../output/${scrapeTarget}_${new Date().toISOString()}.json`;
    const outputContent = JSON.stringify(result, null, 2);

    fs.writeFileSync(outputFile, outputContent, { encoding: 'utf8' });
    consola.success('Output saved to disk!');
    await db.close();
})().catch(error => consola.error(error));

async function runTask(url, extract, insert, db) {
    try {
        return await extract(url, insert, db);
    } catch (error) {
        consola.error(`Error while scraping ${url}!`);
        consola.error(error);
        return null;
    } finally {
        logProgress();
    }
}

function logProgress(increment = true) {
    if (increment) {
        progress.current++;
    }

    consola.info(`Progress ${progress.current}/${progress.total}`);
}