import mysqlConfig from './mysqlConfig';
import { connect } from '@rich_harris/sql';
import ipc from 'node-ipc';

ipc.config.id = 'beerlytics';
ipc.config.logDepth = 0;

export default async function importIpc() {
    const config = Object.assign({ connectionLimit: 100 }, mysqlConfig);
    const db = await connect(config);

    ipc.serve(() => {
        ipc.server.on('reviews', reviews => {
            console.log(reviews);
        });
    });

    ipc.server.start();
}