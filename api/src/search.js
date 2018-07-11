import { connect } from '../../beer-scraper/src/mysql';
import lunr from 'lunr';

let searchIndex = null;
const beerMap = new Map();

export default async function search(request) {
    const { query } = request.params;
    const searchIndex = await getSearchIndex();

    if (!query) {
        const beers = Array.from(beerMap.values());

        return beers.sort((a, b) => {
            if (a.isProcessed && !b.isProcessed) {
                return -1;
            }

            return b.ratings - a.ratings;
        }).slice(0, 16);
    }

    const results = searchIndex.search(query);

    return results.map(result => beerMap.get(result.ref));
}

async function getSearchIndex() {
    if (searchIndex) {
        return searchIndex;
    }

    const db = await connect();
    const { rows } = await db`SELECT id, name, processed, total_ratings, weighted_average, image FROM beers;`;

    await db.close();

    const documents = rows.map(row => {
        const { id, name, image } = row;
        const beer = {
            id: id,
            name: name,
            image: image,
            isProcessed: !!row.processed,
            ratings: row.total_ratings,
            rating: row.weighted_average,
            liked: false,
            disliked: false
        };

        beerMap.set(id.toString(), beer);

        return beer;
    });

    searchIndex = lunr(function() {
        this.ref('id');
        this.field('name');

        documents.forEach(document => this.add(document));
    });

    return searchIndex;
}
