import { connect } from '../../beer-scraper/src/mysql';
import firstRow from './firstRow';

export default async function beer(request) {
    const db = await connect();
    const { id } = request.params;
    const reviews = await loadReviews(id, db);

    await db.close();

    return reviews;
}

async function loadReviews(id, db) {
    const { rows } = await db`
        SELECT reviews.id, reviews.user_id, reviews.date, reviews.location, reviews.text, reviews.score, reviews.aroma, reviews.appearance, reviews.taste, reviews.palate, reviews.overall, review_clusters.embedding, review_clusters.cluster
        FROM reviews
        INNER JOIN review_clusters
        ON reviews.beer_id = ${id} AND reviews.id = review_clusters.review_id AND review_clusters.is_centroid = 1;
    `;
    const userIds = new Set();

    for (const row of rows) {
        userIds.add(row.user_id);
    }

    const tasks = Array.from(userIds).map(userId => {
        return db`SELECT id, name, total_ratings FROM users WHERE id = ${userId} LIMIT 1;`;
    });

    const results = await Promise.all(tasks);
    const users = results.map(result => firstRow(result.rows));
    const userMap = new Map();

    for (const user of users) {
        userMap.set(user.id, {
            name: user.name,
            ratings: user.total_ratings
        });
    }

    for (const row of rows) {
        row.user = userMap.get(row.user_id);
        delete row.user_id;
    }

    return rows;
}
