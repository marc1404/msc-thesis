from gensim.models import KeyedVectors
from gensim.scripts.glove2word2vec import glove2word2vec


def load(beer_id):
    glove_file = f'models/{beer_id}/glove.txt'
    tmp_file = f'models/{beer_id}/glove2word2vec.txt'
    glove2word2vec(glove_file, tmp_file)
    return KeyedVectors.load_word2vec_format(tmp_file, binary=False)
