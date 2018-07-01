from gensim.models import KeyedVectors


def load(beer_id):
    return KeyedVectors.load_word2vec_format(f'models/{beer_id}/starspace.txt', binary=False)
