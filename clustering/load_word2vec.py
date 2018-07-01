from gensim.models import Word2Vec


def load(beer_id):
    return Word2Vec.load(f'models/{beer_id}/word2vec')
