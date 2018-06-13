import { router, get } from 'microrouter';
import cors from 'micro-cors';
import beer from './beer';
import reviews from './reviews';

const enableCors = cors();

export default router(
    get('/beer/:id/reviews', enableCors(reviews)),
    get('/beer/:id', enableCors(beer))
);
