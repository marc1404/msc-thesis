import { connect } from '../../beer-scraper/src/mysql';

let db = null;

export default async function getDb() {
    if (db) {
        return db;
    }

    return db = await connect();
}
