import { connect } from '../beer-scraper/src/mysql';
import splitLines from 'split-lines';
import getIdFromUrl from '../beer-scraper/src/getIdFromUrl';
import fs from 'fs';

(async () => {
    const db = await connect();
    const text = fs.readFileSync('../data/beers_NL.txt', { encoding: 'utf8' });
    const lines = splitLines(text);

    for (const line of lines) {
        const id = getIdFromUrl(line);

        db`
            INSERT INTO beer_urls_nl (id, url) VALUES (${id}, ${line});
        `;
    }
})().catch(error => console.error(error));