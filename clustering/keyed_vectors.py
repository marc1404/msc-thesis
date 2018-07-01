import load_word2vec
import load_fasttext
import load_starspace
import load_glove
import sys


def load():
    if len(sys.argv) != 2:
        raise Exception('Missing embedding CLI argument! (word2vec, fasttext, starspace, glove)')

    embedding = sys.argv[1]

    print('Loading %s model...' % embedding)

    if embedding == 'word2vec':
        return load_word2vec.load()
    elif embedding == 'fasttext':
        return load_fasttext.load()
    elif embedding == 'starspace':
        return load_starspace.load()
    elif embedding == 'glove':
        return load_glove.load()
    else:
        raise Exception('Unknown embedding: %s!' % embedding)
