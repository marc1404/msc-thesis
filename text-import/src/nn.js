import { connect } from '../../beer-scraper/src/mysql';
import fs from 'fs';
import splitLines from 'split-lines';

const beerId = 2360;

(async () => {
    const db = await connect();
    const text = fs.readFileSync('../data/query_nn_output.txt', { encoding: 'utf8' });
    const regex = new RegExp(/Enter some text: (.+?)Enter some text: /gs);
    let result;
    const tasks = [];

    while (result = regex.exec(text)) {
        const match = result[1];
        const lines = splitLines(match).map(line => line.split(' '));
        const query = lines[0][0];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];

            if (line.length < 2) {
                continue;
            }

            const neighbor = line[0];
            const similarity = parseFloat(line[1]);
            const task = db`
                INSERT INTO beer_nn (beer_id, embedding, query, neighbor, similarity)
                VALUES (${beerId}, 'starspace', ${query}, ${neighbor}, ${similarity});
            `;

            tasks.push(task);
        }
    }

    await Promise.all(tasks);
    await db.close();
})().catch(error => console.error(error));
