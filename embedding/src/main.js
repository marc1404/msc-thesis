import { connect } from '../../beer-scraper/src/mysql';
import minimist from 'minimist';
import consola from 'consola';
import cleanText from './cleanText';
import fs from 'fs';

const argv = minimist(process.argv.slice(2));
const isGloVe = argv.embedding === 'glove';
const separator = isGloVe ? ' dummy dummy dummy dummy dummy ' : '\n';

(async () => {
    const db = await connect();
    const { rows } = await db`SELECT id, text FROM reviews WHERE beer_id = 2360;`;
    const ids = [];
    const reviews = [];

    for (const row of rows) {
        const { id, text } = row;
        const cleanedText = cleanText(text);

        if (!cleanedText) {
            continue;
        }

        ids.push(id);
        reviews.push(cleanedText);
    }

    await db.close();

    const trainIdsData = ids.join('\n');
    const trainData = reviews.join(separator);

    fs.writeFileSync('./data/train_ids.txt', trainIdsData);
    fs.writeFileSync('./data/train.txt', trainData);
})().catch(error => consola.error(error));
