import mysqlConfig from './mysqlConfig';
import { connect } from '@rich_harris/sql';
import scrapedReviews from '../../data/scrapedReviews.json';

export default async function importReviews() {
    const config = Object.assign({ connectionLimit: 100 }, mysqlConfig);
    const db = await connect(config);

    await insertScrapedReviews(db, scrapedReviews);
    await db.close();
}

export async function insertScrapedReviews(db, scrapedReviews) {
    await Promise.all([
        insertReviews(db, scrapedReviews),
        insertUsers(db, scrapedReviews)
    ]);
}

async function insertReviews(db, scrapedReviews) {
    const tasks = [];

    for (const beer of scrapedReviews) {
        for (const review of beer.reviews) {
            const task = insertReview(db, beer, review);

            tasks.push(task);
        }
    }

    await Promise.all(tasks);
}

function insertReview(db, beer, review) {
    const { date, location, text } = review;
    const { score, aroma, appearance, taste, palate, overall } = review.rating;

    return db`
        INSERT IGNORE INTO reviews (
            beer_id, user_id, date, location, text, score, aroma, appearance, taste, palate, overall
        ) VALUES (
            ${beer.id}, ${review.user.id}, ${date}, ${location}, ${text}, ${score}, ${aroma}, ${appearance}, ${taste}, ${palate}, ${overall}
        );
    `;
}

async function insertUsers(db, scrapedReviews) {
    const userMap = new Map();

    for (const beer of scrapedReviews) {
        for (const review of beer.reviews) {
            const { user } = review;

            userMap.set(user.id, user);
        }
    }

    const tasks = [];

    for (const user of userMap.values()) {
        const task = db`
            INSERT IGNORE INTO users (id, name, total_ratings) VALUES (${user.id}, ${user.name}, ${user.totalRatings});
        `;

        tasks.push(task);
    }

    await Promise.all(tasks);
}