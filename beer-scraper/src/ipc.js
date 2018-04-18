import ipc from 'node-ipc';
import chalk from 'chalk';

ipc.config.id = 'beerlytics';
ipc.config.logDepth = 0;

export default {
    connect() {
        try {
            ipc.connectTo('beerlytics');
        } catch (error) {
            console.warn(chalk.yellow(error));
        }
    },
    emitReviews(reviews) {
        ipc.of.beerlytics.emit('reviews', reviews);
    },
    disconnect() {
        try {
            ipc.disconnect('beerlytics');
        } catch (error) {
            console.warn(chalk.yellow(error));
        }
    }
}