from itertools import chain
import kmeans
import keyed_vectors

model = keyed_vectors.load()
wv = model.wv


def vectorize(line):
    words = line.split()
    vectors = []

    for word in words:
        if word in wv.vocab:
            vectors.append(wv[word])

    return list(chain.from_iterable(vectors))


file = open('data/train.txt')
X = [vectorize(line) for line in file]

file.close()
kmeans.run(X)
