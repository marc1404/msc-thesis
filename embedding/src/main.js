import { connect } from '../../beer-scraper/src/mysql';
import minimist from 'minimist';
import consola from 'consola';
import removeNewlines from 'newline-remove';
import stopword from 'stopword';
import striptags from 'striptags';
import natural from 'natural';
import fs from 'fs';

const argv = minimist(process.argv.slice(2));
const isGloVe = argv.embedding === 'glove';
const separator = isGloVe ? ' dummy dummy dummy dummy dummy ' : '\n';
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

    const data = reviews.join(separator);

    fs.writeFileSync('./data/train.txt', data);
})().catch(error => consola.error(error));

function cleanText(text) {
    text = removeNewlines(text);
    text = striptags(text);
    text = removeDigits(text);
    text = removeUpdatedPrefix(text);
    let tokens = tokenizer.tokenize(text);
    tokens = stopword.removeStopwords(tokens);
    tokens = tokens.map(token => stem(token));
    tokens = tokens.map(americanify);

    return tokens.join(' ');
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

function stem(token) {
    return natural.PorterStemmer.stem(token);
}

function americanify(token) {
    if (token === 'colour') {
        return 'color';
    }

    return token;
}