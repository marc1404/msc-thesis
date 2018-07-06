import { connect } from '../../beer-scraper/src/mysql';
import replace from 'replace-in-file';
import exec from 'exec-sh';
import consola from 'consola';

(async () => {
    const db = await connect();
    const { rows: beerRows } = await db`SELECT id FROM beers WHERE processed = 0 AND total_ratings >= 100 ORDER BY total_ratings ASC;`;
    const beerIds = beerRows.map(row => row.id);

    for (const beerId of beerIds) {
        try {
            await processBeer(beerId, db);
        } catch (error) {
            consola.error(`Error while processing beer ${beerId}!`);
            consola.error(error);
        }
    }

    await db.close();
})().catch(error => consola.error(error));

async function processBeer(beerId, db) {
    consola.start(`Processing beer ${beerId}...`);

    const { rows: reviewRows } = await db`SELECT id FROM reviews WHERE beer_id = ${beerId} AND language = 'en';`;

    if (reviewRows.length < 100) {
        consola.warn(`Skipping because there are only ${reviewRows.length} reviews!`);
        return;
    }

    await replace({
        files: [
            '.env',
            '../clustering/.env'
        ],
        from: /BEER_ID=[0-9]*/g,
        to: `BEER_ID=${beerId}`,
    });

    return;
    await sleep(1000);
    await run('yarn start');
    await run(`mkdir -p ../clustering/data/${beerId}`);
    await run(`mkdir -p ../clustering/models/${beerId}`);
    await run(`\\cp -f data/train.txt ../clustering/data/${beerId}/train.txt`);
    await run(`\\cp -f data/train_ids.txt ../clustering/data/${beerId}/train_ids.txt`);
    await run(`\\cp -f data/train.txt ../../StarSpace/train.txt`);
    await run(`\\cp -f data/train.txt ../../fastText/train.txt`);
    await run(`\\cp -f data/train_glove.txt ../../GloVe/build/train_glove.txt`);

    await Promise.all([
        run('cd ../../GloVe/build && ./train.sh'),
        run('cd ../clustering && python train_word2vec.py'),
        run('cd ../../fastText && ./train.sh'),
        run('cd ../../StarSpace && ./train.sh')
    ]);

    await Promise.all([
        run(`\\cp -f ../../GloVe/build/vectors.txt ../clustering/models/${beerId}/glove.txt`),
        run(`\\cp -f ../../fastText/model.vec ../clustering/models/${beerId}/fasttext.vec`),
        run(`\\cp -f ../../StarSpace/model.tsv ../clustering/models/${beerId}/starspace.tsv`)
    ]);

    await run('cd ../clustering && python starspace_tsv2txt.py');
    await run('cd ../clustering && ./query_nn.sh');
    await run('cd ../clustering && ./all.sh');

    await db`UPDATE beers SET processed = 1 WHERE id = ${beerId} LIMIT 1;`;
    consola.success(`Processed beer ${beerId}!`);
}

function run(command) {
    consola.start(command);

    return new Promise((resolve, reject) => {
        exec(command, error => {
            if (error) {
                reject(error);
                return;
            }

            resolve();
        });
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}