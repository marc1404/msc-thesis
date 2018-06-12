from gensim.models import KeyedVectors
from gensim.scripts.glove2word2vec import glove2word2vec

glove_file = 'models/glove.txt'
tmp_file = 'models/glove2word2vec.txt'

def load():
    glove2word2vec(glove_file, tmp_file)
    return KeyedVectors.load_word2vec_format(tmp_file, binary=False)
