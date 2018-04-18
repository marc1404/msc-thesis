import chalk from 'chalk';
import { Beer, Ratings, Stats, Brewery, Style } from './models';
import getIdFromUrl from './getIdFromUrl';

export default function extractBeer($, url) {
    const id = getIdFromUrl(url);
    const name = $('h1', 'div.user-header').text().trim();
    const brewery = extractBrewery($);
    const style = extractStyle($);
    const location = extractLocation($);
    const image = $('#beerImg').attr('src');
    const ratings = extractRating($);
    const stats = extractStats($);
    const description = $('#_description3').text().trim();
    const tags = extractTags($);

    return new Beer({
        id: id,
        url: url,
        name: name,
        brewery: brewery,
        style: style,
        location: location,
        image: image,
        ratings: ratings,
        description: description,
        stats: stats,
        tags: tags
    });
}

function extractBrewery($) {
    const linkElement = $('#_brand4');
    const url = `https://ratebeer.com${linkElement.attr('href')}`;
    const id = getIdFromUrl(url);
    const name = linkElement.children('span').text();

    return new Brewery({
        id: id,
        url: url,
        name: name
    });
}

function extractStyle($) {
    const linkElement = $('#styleTopFifty').prev('a');
    const url = `https://ratebeer.com${linkElement.attr('href')}`;
    const id = getIdFromUrl(url);
    const name = linkElement.text();

    return new Style({
        id: id,
        url: url,
        name: name
    });
}

function extractRating($) {
    const { overall, style } = extractAggregated($);
    const weightedAverage = $('a[name="real average"]', '.stats-container').find('span[itemprop="ratingValue"]').text();
    const count = $('#_ratingCount8').text();

    return new Ratings({
        overall: overall,
        style: style,
        weightedAverage: toFloat(weightedAverage),
        count: toNumber(count)
    });
}

function extractAggregated($) {
    const isEmpty = $('#_aggregateRating6', '#container').has('.empty-placeholder');

    if (isEmpty) {
        return { overall: null, style: null };
    }

    const overall = $('.ratingValue', '#_aggregateRating6').text();
    const style = $('.style-text', '#_aggregateRating6').prev()[0].prev.data;

    return {
        overall: toNumber(overall),
        style: toNumber(style)
    };
}

function extractStats($) {
    const ibu = $('abbr[title="International Bittering Units - Normally from hops"]', '.stats-container').next().text();
    const calories = $('abbr[title="Estimated calories for a 12 fluid ounce serving"]', '.stats-container').next().text();
    const abvPercent = $('abbr[title="Alcohol By Volume"]', '.stats-container').next().children('strong').text();
    const abv = abvPercent.slice(0, abvPercent.length - 1);

    return new Stats({
        ibu: toNumber(ibu),
        calories: toNumber(calories),
        abv: toFloat(abv)
    });
}

function extractTags($) {
    const tags = [];

    $('span.tags', 'div.tag-container').each((index, element) => {
        const hashTag = $(element).children('a').text();
        const tag = hashTag.slice(1);

        tags.push(tag);
    });

    return tags;
}

function extractLocation($) {
    try {
        let element = $('#styleTopFifty').next()[0];
        let location = '';

        while(element = element.next) {
            let chunk = element.type === 'text' ? element.data : $(element).text();
            chunk = chunk.trim();

            if (chunk === ',') {
                location += chunk;
                continue;
            }

            location += ` ${chunk}`;
        }

        return location.trim();
    } catch (error) {
        console.warn(chalk.yellow(error.stack));
    }

    return null;
}

function toNumber(value) {
    return parseInt(value, 10);
}

function toFloat(value) {
    return parseFloat(value);
}