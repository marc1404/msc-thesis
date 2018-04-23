import getIdFromUrl from '../getIdFromUrl';

export default {
    scrapedMap: new Map(),
    skipped: 0,
    async init(db) {
        const { rows } = await db`SELECT id, scraped FROM beers;`;

        for (const row of rows) {
            this.scrapedMap.set(row.id, row.scraped);
        }
    },
    check(url) {
        const id = getIdFromUrl(url);
        const isScraped = this.scrapedMap.get(id);

        if (isScraped) {
            this.skipped++;
            return false;
        }

        return true;
    }
};