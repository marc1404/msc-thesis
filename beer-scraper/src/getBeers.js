import fs from 'fs';
import splitLines from 'split-lines';

export default filePath => {
    const text = fs.readFileSync(filePath, { encoding: 'utf8' });

    return splitLines(text);
};