import load_word2vec
import load_fasttext
import load_starspace
import load_glove
import sys


def load(beer_id):
    if len(sys.argv) != 2:
        raise Exception('Missing embedding CLI argument! (word2vec, fasttext, starspace, glove)')

    embedding = sys.argv[1]

    print('Loading %s model...' % embedding)

    if embedding == 'word2vec':
        return load_word2vec.load(beer_id)
    elif embedding == 'fasttext':
        return load_fasttext.load(beer_id)
    elif embedding == 'starspace':
        return load_starspace.load(beer_id)
    elif embedding == 'glove':
        return load_glove.load(beer_id)
    else:
        raise Exception('Unknown embedding: %s!' % embedding)
