import { router, get } from 'microrouter';
import { send } from 'micro';
import { connect } from '../../beer-scraper/src/mysql';

let db = null;

export default router(
  get('/beer/:id', beer)
);

async function beer(request, response) {
  const db = await getDb();
  const { id } = request.params;



  return send(response, 200, 'Hello World!');
}

async function getDb() {
  if (db) {
    return db;
  }

  return db = await connect();
}