from itertools import chain
from sklearn.metrics import pairwise_distances_argmin_min
import load_word2vec
import load_fasttext
import kmeans
import sys

embedding = sys.argv[1]
model = None

print('Loading %s model...' % embedding)

if embedding == 'word2vec':
    model = load_word2vec.load()
elif embedding == 'fasttext':
    model = load_fasttext.load()
else:
    raise Exception('Unknown embedding: %s!' % embedding)

print('Done.')

wv = model.wv

def vectorize(line):
    words = line.split()
    vectors = []

    for word in words:
        if word in wv.vocab:
            vectors.append(wv[word])

    return list(chain.from_iterable(vectors))

file = open('train.txt')
X = [vectorize(line) for line in file]

file.close()
kmeans.run(X)
