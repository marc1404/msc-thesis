import fetch from 'node-fetch';
import getIdFromUrl from '../getIdFromUrl';
import { Review, ReviewRating, User } from '../models';
import consola from 'consola';

export default async function queryReviews(url, insert, db) {
    let allReviews = [];
    const id = getIdFromUrl(url);
    let last = null;

    do {
        const result = await fetchReviews(id, last);

        if (!result) {
            break;
        }

        last = result.last;
        const reviews = result.items.map(mapToModel);
        allReviews = allReviews.concat(reviews);

        const beerReviews = {
            id: id,
            reviews: reviews
        };

        await insert(beerReviews, db);
    } while (last);

    await db`UPDATE beers SET scraped = 1 WHERE id = ${id};`;

    return allReviews;
}

function mapToModel(item) {
    const { comment, score, scores, author, createdAt, checkin } = item;
    const { appearance, aroma, flavor, mouthfeel, overall } = scores;
    const { id: userId, username, reviewCount } = author;
    const location = mapCheckinToLocation(checkin);
    const user = new User({
        id: userId,
        name: username,
        totalRatings: reviewCount
    });
    const rating = new ReviewRating({
        score: score,
        aroma: aroma,
        appearance: appearance,
        taste: flavor,
        palate: mouthfeel,
        overall: overall
    });

    if (location.length) {
        console.log(location, location.length);
    }

    return new Review({
        rating: rating,
        user: user,
        location: location,
        text: comment,
        date: new Date(createdAt)
    });
}

function mapCheckinToLocation(checkin) {
    if (!checkin) {
        return '';
    }

    const { place } = checkin;

    const parts = [
        place.name,
        place.city,
        place.state && place.state.name,
        place.country && place.country.name
    ];

    return parts
        .filter(part => Boolean(part))
        .join(', ');
}

async function fetchReviews(beerId, after = null, retryDepth = 0) {
    const url = 'https://beta.ratebeer.com/v1/api/graphql/';
    const method = 'POST';
    const headers = {
        'Content-Type': 'application/json'
    };
    const variables = {
        order: 'RECENT',
        beerId: beerId
    };

    if (after) {
        variables.after = after;
    }

    const body = JSON.stringify([{
        operationName: 'beerReviews',
        variables: variables,
        query: 'query beerReviews($beerId: ID!, $authorId: ID, $order: ReviewOrder, $after: ID) {\n  beerReviewsArr: beerReviews(beerId: $beerId, authorId: $authorId, order: $order, after: $after) {\n    items {\n      id\n      comment\n      score\n      scores {\n        appearance\n        aroma\n        flavor\n        mouthfeel\n        overall\n        __typename\n      }\n      author {\n        id\n        username\n        reviewCount\n        __typename\n      }\n      checkin {\n        id\n        place {\n          name\n          city\n          state {\n            name\n            __typename\n          }\n          country {\n            name\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      createdAt\n      updatedAt\n      __typename\n    }\n    totalCount\n    last\n    __typename\n  }\n}\n'
    }]);

    const response = await fetch(url, { method, headers, body });
    const { status } = response;

    if (response.status !== 200) {
        retryDepth++;

        if (retryDepth > 10) {
            consola.error(`Reached maximum retry depth for beer ${beerId} with status ${status}!`);

            return null;
        }

        consola.warn(`Retrying beer ${beerId} because of status ${status}`);

        return await fetchReviews(beerId, after, retryDepth);
    }

    const result = await response.json();

    return result[0].data.beerReviewsArr;

}