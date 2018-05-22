import scrape from '../scrape';
import getIdFromUrl from '../getIdFromUrl';

export default async function extractPlaceBeers(url, insert, db) {
    const $ = await scrape(url);
    const placeId = getIdFromUrl(url);
    const tableBody = $('tbody', '#beer-entries');
    const beerUrls = [];

    tableBody.children().each((index, row) => {
        const beerUrl = $(row).find('a').first().attr('href');

        if (beerUrl !== '#') {
            beerUrls.push(beerUrl);
        }
    });

    const beerIds = beerUrls.map(getIdFromUrl);
    const placeBeers = beerIds.map(beerId => ({ placeId, beerId }));

    await insert(placeBeers, db);
    await db`UPDATE places SET scraped_beers = 1 WHERE id = ${placeId};`;

    return placeBeers;
}