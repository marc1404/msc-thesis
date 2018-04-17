import fs from 'fs';
import splitLines from 'split-lines';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import pLimit from 'p-limit';
import extractBeer from './extractBeer';
import chalk from 'chalk';

const filePath = '../data/beers_NL.txt';
const progress = {
    total: 0,
    current: 0
};

main().catch(error => console.error(chalk.bold.red(error.stack)));

async function main() {
    const limit = pLimit(100);
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
}

async function scrapeBeerUrl(url) {
    try {
        const body = await fetchBody(url);
        const $ = cheerio.load(body);

        return extractBeer($, url);
    } catch (error) {
        console.error(chalk.bold.red(`Error on: ${url}`));
        console.error(chalk.bold.red(error.stack));
    } finally {
        console.log(chalk.green(`${++progress.current}/${progress.total}`));
    }

    return null;
}

async function fetchBody(url) {
    const response = await fetch(url);

    return await response.text();
}