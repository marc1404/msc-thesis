import fs from 'fs';
import splitLines from 'split-lines';

const filePath = '../data/beers.txt';

export default () => {
    const text = fs.readFileSync(filePath, { encoding: 'utf8' });

    return splitLines(text);
};