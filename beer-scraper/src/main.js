import fs from 'fs';
import splitLines from 'split-lines';
import pLimit from 'p-limit';
import extractBeer from './extractBeer';
import extractReviews from './extractReviews';
import chalk from 'chalk';
import scrape from './scrape';

const filePath = '../data/beers_NL.txt';
const concurrency = 100;
const progress = {
    total: 0,
    current: 0
};

(async () => {
    const limit = pLimit(concurrency);
    const text = fs.readFileSync(filePath, { encoding: 'utf8' });
    const lines = splitLines(text);
    progress.total = lines.length;
    const tasks = lines.map(line => {
        return limit(() => scrapeBeerUrl(line));
    });

    console.log(chalk.green(`0/${progress.total}`));

    const result = await Promise.all(tasks);
    const outputFile = `output/scraped-beers_${new Date().toISOString()}.json`;
    const outputContent = JSON.stringify(result, null, 2);

    fs.writeFileSync(outputFile, outputContent, { encoding: 'utf8' });
})().catch(error => console.error(chalk.bold.red(error.stack)));

async function scrapeBeerUrl(url) {
    try {
        const $ = await scrape(url);

        return extractBeer($, url);
        //return await extractReviews($, url);
    } catch (error) {
        console.error(chalk.bold.red(`Error on: ${url}`));
        console.error(chalk.bold.red(error.stack));
    } finally {
        console.log(chalk.green(`${++progress.current}/${progress.total}`));
    }

    return null;
}