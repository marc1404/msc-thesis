import getIdFromUrl from '../getIdFromUrl';

export default {
    beerMap: new Map(),
    skipped: 0,
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
            this.skipped++;
            return false;
        }
        
        return true;
    }
};