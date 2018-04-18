import prompts from 'prompts';
import chalk from 'chalk';
import importCsv from './importCsv';
import importBeers from './importBeers';
import importReviews from './importReviews';
import importIpc from './importIpc';

(async () => {
    const { response } = await prompts({
        type: 'select',
        name: 'response',
        message: 'What should be imported?',
        choices: [
            { title: 'Beers', value: 'beers' },
            { title: 'Reviews', value: 'reviews' },
            { title: 'CSV', value: 'csv' },
            { title: 'IPC', value: 'ipc' }
        ]
    });

    const tasks = {
        beers: () => importBeers(),
        reviews: () => importReviews(),
        csv: () => importCsv(),
        ipc: () => importIpc()
    };

    await tasks[response]();
})().catch(error => console.error(chalk.bold.red(error.stack)));