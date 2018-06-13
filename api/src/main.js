import { router, get } from 'microrouter';
import beer from './beer';
import reviews from './reviews';

export default router(
    get('/beer/:id/reviews', reviews),
    get('/beer/:id', beer)
);
