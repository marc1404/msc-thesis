export default async function insertReviews(beerReviews, db) {
    await Promise.all([
        insertOnlyReviews(beerReviews, db),
        insertUsers(beerReviews.reviews, db)
    ]);

    await updateScraped(beerReviews.id, db);
}

async function insertOnlyReviews(beerReviews, db) {
    const tasks = [];

    for (const review of beerReviews.reviews) {
        const task = insertReview(beerReviews.id, review, db);

        tasks.push(task);
    }

    await Promise.all(tasks);
}

function insertReview(beerId, review, db) {
    const { date, location, text } = review;
    const { score, aroma, appearance, taste, palate, overall } = review.rating;

    return db`
        INSERT IGNORE INTO reviews (
            beer_id, user_id, date, location, text, score, aroma, appearance, taste, palate, overall
        ) VALUES (
            ${beerId}, ${review.user.id}, ${date}, ${location}, ${text}, ${score}, ${aroma}, ${appearance}, ${taste}, ${palate}, ${overall}
        );
    `;
}

async function insertUsers(reviews, db) {
    const userMap = new Map();

    for (const review of reviews) {
        const { user } = review;

        userMap.set(user.id, user);
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

async function updateScraped(beerId, db) {
    return db`UPDATE beers SET scraped = 1 WHERE id = ${beerId};`;
}