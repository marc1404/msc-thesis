import mysqlConfig from './mysqlConfig';
import { connect } from '@rich_harris/sql';
import ipc from 'node-ipc';
import { insertScrapedReviews } from './importReviews';
import chalk from 'chalk';

ipc.config.id = 'beerlytics';
ipc.config.logDepth = 0;

export default async function importIpc() {
    const config = Object.assign({ connectionLimit: 100 }, mysqlConfig);
    const db = await connect(config);

    ipc.serve(() => {
        ipc.server.on('reviews', beer => {
            insertScrapedReviews(db, [beer])
                .then(() => console.info(chalk.green(`Inserted ${beer.reviews.length} reviews!`)))
                .catch(error => console.error(chalk.bold.red(error)));
        });
    });

    ipc.server.start();
}