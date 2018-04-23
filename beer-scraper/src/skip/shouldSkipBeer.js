import consola from 'consola';
import getIdFromUrl from '../getIdFromUrl';

export default {
    beerMap: new Map(),
    async init(db) {
        const { rows } = await db`SELECT id FROM beers;`;

        for (const row of rows) {
            this.beerMap.set(row.id, true);
        }
    },
    check(url) {
        const id = getIdFromUrl(url);
        const hasBeer = this.beerMap.has(id);

        if (hasBeer) {
            consola.info(`Skipping ${url}`);
            return false;
        }
        
        return true;
    }
};