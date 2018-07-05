import { router, get } from 'microrouter';
import microCors from 'micro-cors';
import beer from './beer';
import reviews from './reviews';
import places from './places';
import userLocations from './userLocations';
import nn from './nn';
import search from './search';

const cors = microCors();

export default router(
    get('/search/(:query)', cors(search)),
    get('/beer/:id/nn', cors(nn)),
    get('/beer/:id/places', cors(places)),
    get('/beer/:id/reviews', cors(reviews)),
    get('/beer/:id', cors(beer)),
    get('/user/:id/locations', cors(userLocations))
);
