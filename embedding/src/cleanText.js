import stopword from 'stopword';
import striptags from 'striptags';
import removeNewlines from 'newline-remove';
import natural from 'natural';

const tokenizer = new natural.WordTokenizer();

export default function cleanText(text) {
    text = text.toLowerCase();
    text = removeNewlines(text);
    text = striptags(text);
    text = removeDigits(text);
    text = removeUpdatedPrefix(text);
    let tokens = tokenizer.tokenize(text);
    tokens = stopword.removeStopwords(tokens);
    tokens = tokens.map(token => stem(token));
    tokens = tokens.map(americanify);

    return tokens.join(' ');
}

function removeDigits(text) {
    return text.replace(/[0-9]/g, '');
}

function removeUpdatedPrefix(text) {
    if (text.startsWith('updated')) {
        return text.replace('updated', '');
    }

    return text;
}

function stem(token) {
    return natural.PorterStemmer.stem(token);
}

function americanify(token) {
    const variations = {
        colour: 'color',
        flavour: 'flavor',
        favourit: 'favorit'
    };

    return variations[token] || token;
}
