import minimist from 'minimist';
import consola from 'consola';
import cleanText from '../src/cleanText';

const argv = minimist(process.argv.slice(2));
const { text } = argv;

if (!text) {
    consola.error('Missing CLI argument: --text=?');
    process.exit(1);
}

const cleaned = cleanText(text);

consola.info(cleaned);
