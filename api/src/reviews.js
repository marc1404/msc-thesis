import { connect } from '../../beer-scraper/src/mysql';
import firstRow from './firstRow';
import castToAverageRating from './castToAverageRating';

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

    await loadUsers(rows, db);

    return rows;
}

async function loadUsers(reviews, db) {
    const userIds = new Set();

    for (const review of reviews) {
        userIds.add(review.user_id);
    }

    const tasks = Array.from(userIds).map(userId => {
        return db`SELECT id, name, total_ratings FROM users WHERE id = ${userId} LIMIT 1;`;
    });

    const results = await Promise.all(tasks);
    const users = results.map(result => firstRow(result.rows));
    const userMap = new Map();
    const averageTasks = users.map(user => {
        return db`
            SELECT AVG(aroma) AS aroma, AVG(appearance) AS appearance, AVG(taste) AS taste, AVG(palate) as palate, AVG(overall) as overall
            FROM reviews
            WHERE user_id = ${user.id};
        `;
    });
    const averageResults = await Promise.all(averageTasks);

    for (let i = 0; i < users.length; i++) {
        users[i].averageRating = castToAverageRating(firstRow(averageResults[i].rows));
    }

    for (const user of users) {
        userMap.set(user.id, {
            id: user.id,
            name: user.name,
            ratings: user.total_ratings,
            averageRating: user.averageRating
        });
    }

    for (const review of reviews) {
        review.user = userMap.get(review.user_id);
        delete review.user_id;
    }
}