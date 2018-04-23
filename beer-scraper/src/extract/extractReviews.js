import getIdFromUrl from '../getIdFromUrl';
import { Review, ReviewRating, User } from '../models';
import moment from 'moment';
import pLimit from 'p-limit';
import scrape from '../scrape';

const concurrency = 10;
const scoreRegex = /^\d(?:\.\d)?/;
const aromaRegex = /Aroma (\d+)/;
const appearanceRegex = /Appearance (\d)/;
const tasteRegex = /Taste (\d+)/;
const palateRegex = /Palate (\d)/;
const overallRegex = /Overall (\d+)/;

export default async function extractReviews(url, $, insert, db) {
    const id = getIdFromUrl(url);
    let reviews = extractReviewsOnPage($);
    const totalPages = extractTotalPages($);
    const limit = pLimit(concurrency);
    const tasks = [];

    for (let i = 2; i <= totalPages; i++) {
        const pageUrl = `${url}1/${i}/`;
        const task = limit(() => extractReviewsFromPage(pageUrl));

        tasks.push(task);
    }

    const result = await Promise.all(tasks);

    for (const pageReviews of result) {
        reviews = reviews.concat(pageReviews);
    }

    const beerReviews = {
        id: id,
        reviews: reviews
    };

    await insert(beerReviews, db);

    return beerReviews;
}

function extractTotalPages($) {
    const totalPages = $('a.ballno', '#container').last().text();

    return parseInt(totalPages, 10);
}

async function extractReviewsFromPage(url) {
    const $ = await scrape(url);

    return extractReviewsOnPage($);
}

function extractReviewsOnPage($) {
    const reviews = [];
    const containerElement = $('.reviews-container', '#container').children().first().children().first();
    const reviewStartElements = containerElement.children('div[style="padding: 0px 0px 0px 0px;"]');

    reviewStartElements.each((index, element) => {
        const review = extractReview($(element));

        reviews.push(review);
    });

    return reviews;
}

function extractReview(startElement) {
    const rating = extractRating(startElement);
    const user = extractUser(startElement);
    const { location, date } = extractLocationAndDate(startElement);
    const text = extractText(startElement);

    return new Review({
        rating: rating,
        user: user,
        location: location,
        date: date,
        text: text
    });
}

function extractRating(startElement) {
    const ratingElement = startElement.children().last();
    const ratingText = ratingElement.attr('title');
    const score = scoreRegex.exec(ratingText)[0];
    let aroma, appearance, taste, palate, overall = null;

    if (ratingText.length > 20) {
        aroma = aromaRegex.exec(ratingText)[1];
        appearance = appearanceRegex.exec(ratingText)[1];
        taste = tasteRegex.exec(ratingText)[1];
        palate = palateRegex.exec(ratingText)[1];
        overall = overallRegex.exec(ratingText)[1];
        aroma = parseInt(aroma, 10);
        appearance = parseInt(appearance, 10);
        taste = parseInt(taste, 10);
        palate = parseInt(palate, 10);
        overall = parseInt(overall, 10);
    }

    return new ReviewRating({
        score: parseFloat(score),
        aroma: aroma,
        appearance: appearance,
        taste: taste,
        palate: palate,
        overall: overall
    });
}

function extractUser(startElement) {
    const linkElement = startElement.next().children('a').first();
    const href = linkElement.attr('href');
    const id = getIdFromUrl(href);
    const [name, totalRatingsWithSuffix] = linkElement.text().split('\xa0(');
    const totalRatings = totalRatingsWithSuffix.slice(0, totalRatingsWithSuffix.length - 1);

    return new User({
        id: id,
        name: name,
        totalRatings: parseInt(totalRatings, 10)
    });
}

function extractLocationAndDate(startElement) {
    const combinedText = startElement.next().children('a').first()[0].next.data;
    const chunks = combinedText.split(' - ');
    const rawLocation = chunks[1];
    const rawDate = chunks[2];

    return {
        location: normalizeLocation(rawLocation),
        date: normalizeDate(rawDate)
    };
}

function normalizeLocation(rawLocation) {
    const chunks = rawLocation.split(', ');
    const country = chunks[chunks.length - 1];
    chunks[chunks.length - 1] = country.charAt(0) + country.slice(1).toLowerCase();

    return chunks.join(', ');
}

function normalizeDate(rawDate) {
    return moment(rawDate, 'MMM D, YYYY').hour(12).toDate();
}

function extractText(startElement) {
    return startElement.next().next().next().text().trim();
}