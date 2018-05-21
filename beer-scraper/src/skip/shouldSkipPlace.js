import getIdFromUrl from '../getIdFromUrl';

export default {
    placeSet: new Set(),
    skipped: 0,
    async init(db) {
        const { rows } = await db`SELECT id FROM places;`;

        for (const row of rows) {
            this.placeSet.add(row.id);
        }
    },
    check(url) {
        const id = getIdFromUrl(url);
        const hasPlace = this.placeSet.has(id);

        if (hasPlace) {
            this.skipped++;
            return false;
        }

        return true;
    }
};