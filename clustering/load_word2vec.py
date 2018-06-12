from gensim.models import Word2Vec

def load():
    return Word2Vec.load('models/word2vec')
