import { connect } from '../../beer-scraper/src/mysql';
import consola from 'consola';
import removeNewlines from 'newline-remove';
import stopword from 'stopword';
import striptags from 'striptags';
import natural from 'natural';
import fs from 'fs';

const tokenizer = new natural.WordTokenizer();

(async () => {
    const db = await connect();
    const { rows } = await db`SELECT * FROM reviews WHERE beer_id = 2360;`;
    const reviews = [];

    for (const row of rows) {
        const { text } = row;
        const cleanedText = cleanText(text);

        if (!cleanedText) {
            continue;
        }

        reviews.push(cleanedText);
    }

    await db.close();

    const data = reviews.join('\n');

    fs.writeFileSync('./data/train.txt', data);
})().catch(error => consola.error(error));

function cleanText(text) {
    text = removeNewlines(text);
    text = striptags(text);
    text = removeDigits(text);
    text = removeUpdatedPrefix(text);
    const tokens = tokenizer.tokenize(text);
    const cleanedTokens = stopword.removeStopwords(tokens);

    return cleanedTokens.join(' ');
}

function removeDigits(text) {
    return text.replace(/[0-9]/g, '');
}

function removeUpdatedPrefix(text) {
    if (text.startsWith('Updated')) {
        return text.replace('Updated', '');
    }

    return text;
}