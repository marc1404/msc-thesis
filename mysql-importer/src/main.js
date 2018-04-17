import prompts from 'prompts';
import chalk from 'chalk';
import importCsv from './importCsv';
import importBeers from './importBeers';

(async () => {
    const { response } = await prompts({
        type: 'select',
        name: 'response',
        message: 'What should be imported?',
        choices: [
            { title: 'Beers', value: 'beers' },
            { title: 'Reviews', value: 'reviews' },
            { title: 'CSV', value: 'csv' }
        ]
    });

    const tasks = {
        beers: () => importBeers(),
        csv: () => importCsv()
    };

    await tasks[response]();
})().catch(error => console.error(chalk.bold.red(error.stack)));