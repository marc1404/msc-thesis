from gensim.models import KeyedVectors


def load():
    return KeyedVectors.load_word2vec_format('models/starspace.txt', binary=False)
