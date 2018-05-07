import { createBeerQuery, createTagsQuery } from '../graphql';
import fetch from 'node-fetch';
import getIdFromUrl from '../getIdFromUrl';
import { Beer, Ratings, Stats, Brewery, Style } from '../models';

const apiUrl = 'https://beta.ratebeer.com/v1/api/graphql/';

export default async function queryBeer(url, insert, db) {
    const id = getIdFromUrl(url);
    const requestBody = [
        createBeerQuery(id),
        createTagsQuery(id)
    ];
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    };
    const response = await fetch(apiUrl, requestOptions);
    const result = await response.json();
    const beerResult = result.data.info;
    const tagResult = result.data.tagDisplayArr.items;

    return result;
}