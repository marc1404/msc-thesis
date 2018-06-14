import { router, get } from 'microrouter';
import microCors from 'micro-cors';
import beer from './beer';
import reviews from './reviews';
import places from './places';

const cors = microCors();

export default router(
    get('/beer/:id/places', cors(places)),
    get('/beer/:id/reviews', cors(reviews)),
    get('/beer/:id', cors(beer))
);
