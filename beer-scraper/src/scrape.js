import fetch from 'node-fetch';
import cheerio from 'cheerio';

export default async function scrape(url) {
    const encodedUrl = encodeURI(url);
    const response = await fetch(encodedUrl);
    const body = await response.text();

    return cheerio.load(body);
}