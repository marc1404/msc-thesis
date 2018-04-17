import mysql from 'mysql2/promise';
import parse from 'csv-parse';
import transform from 'stream-transform';
import fs from 'fs';
import mysqlConfig from './mysqlConfig';

const filePath = '../data/beer_reviews.csv';

export default async function importCsv() {
    const connection = await mysql.createConnection(mysqlConfig);
    const input = await fs.createReadStream(filePath, { encoding: 'utf8' });
    const parser = parse({ columns: true });
    let count = 0;
    const transformer = transform(async (record, callback) => {
        await insertRecord(connection, record);
        callback();
        console.log(++count);
    }, { parallel: 10 });

    input
        .pipe(parser)
        .pipe(transformer);

    console.log('Finished!');
}

async function insertRecord(connection, record) {
    let {
        brewery_id: breweryId,
        brewery_name: breweryName,
        review_time: reviewTime,
        review_overall: reviewOverall,
        review_aroma: reviewAroma,
        review_appearance: reviewAppearance,
        review_profilename: userName,
        beer_style: beerStyle,
        review_palate: reviewPalate,
        review_taste: reviewTaste,
        beer_name: beerName,
        beer_abv: beerAbv,
        beer_beerid: beerId
    } = record;
    breweryId = toNumber(breweryId);
    reviewTime = new Date(toNumber(reviewTime) * 1000);
    reviewOverall = parseFloat(reviewOverall);
    reviewAroma = parseFloat(reviewAroma);
    reviewAppearance = parseFloat(reviewAppearance);
    reviewPalate = parseFloat(reviewPalate);
    reviewTaste = parseFloat(reviewTaste);
    beerAbv = parseFloat(beerAbv);
    beerId = toNumber(beerId);

    await connection.execute('INSERT IGNORE INTO breweries (id, name) VALUES (?, ?)', [breweryId, breweryName]);
    await connection.execute('INSERT IGNORE INTO beer_styles (name) VALUES (?)', [beerStyle]);
    await connection.execute('INSERT IGNORE INTO users (name) VALUES (?)', [userName]);

    const [styleRows] = await connection.execute('SELECT id FROM beer_styles WHERE name = ?', [beerStyle]);
    const [userRows] = await connection.execute('SELECT id FROM users WHERE name = ?', [userName]);
    const styleId = styleRows[0].id;
    const userId = userRows[0].id;

    await connection.execute('INSERT IGNORE INTO beers (id, style_id, name, abv) VALUES (?, ?, ?, ?)', [beerId, styleId, beerName, beerAbv]);
    await connection.execute('INSERT IGNORE INTO brewery_beers (brewery_id, beer_id) VALUES (?, ?)', [breweryId, beerId]);
    await connection.execute('INSERT IGNORE INTO reviews (user_id, beer_id, created, overall, aroma, appearance, palate, taste, text) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [userId, beerId, reviewTime, reviewOverall, reviewAroma, reviewAppearance, reviewPalate, reviewTaste, '']);
}

function toNumber(value) {
    return Number.parseInt(value, 10);
}