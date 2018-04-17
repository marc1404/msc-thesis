import fetch from 'node-fetch';
import cheerio from 'cheerio';

export default async function scrape(url) {
    const response = await fetch(url);
    const body = await response.text();

    return cheerio.load(body);
}