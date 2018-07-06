import { connect } from '../../beer-scraper/src/mysql';
import consola from 'consola';
import cleanText, { getDictionary } from './cleanText';
import fs from 'fs';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));
const beerId = argv.beer || Number.parseInt(process.env.BEER_ID, 10);

(async () => {
    consola.start('Connecting to database...');

    const db = await connect();

    consola.success('Connected!');
    consola.start(`Loading reviews for beer ${beerId}...`);

    const { rows } = await db`SELECT id, text FROM reviews WHERE beer_id = ${beerId} AND language = 'en';`;

    consola.success(`Found ${rows.length} reviews!`);

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

    await saveDictionary(db);
    await db.close();

    const trainIdsData = ids.join('\n');
    const trainData = reviews.join('\n');
    const trainGloVeData = reviews.join(' dummy dummy dummy dummy dummy ');

    fs.writeFileSync('./data/train_ids.txt', trainIdsData);
    fs.writeFileSync('./data/train.txt', trainData);
    fs.writeFileSync('./data/train_glove.txt', trainGloVeData);
})().catch(error => consola.error(error));

async function saveDictionary(db) {
    const dictionary = getDictionary();
    const tasks = [];

    for (const [originalToken, cleanedToken] of dictionary) {
        const task = db`
            INSERT IGNORE INTO token_dictionary (original_token, cleaned_token)
            VALUES (${originalToken}, ${cleanedToken});
        `;

        tasks.push(task);
    }

    await Promise.all(tasks);
}
