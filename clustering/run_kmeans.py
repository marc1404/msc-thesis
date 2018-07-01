from itertools import chain
import kmeans
import keyed_vectors
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path='.env')

beer_id = os.getenv('BEER_ID')
model = keyed_vectors.load(beer_id)
wv = model.wv


def vectorize(line):
    words = line.split()
    vectors = []

    for word in words:
        if word in wv.vocab:
            vectors.append(wv[word])

    return list(chain.from_iterable(vectors))


file = open(f'data/{beer_id}/train.txt')
X = [vectorize(line) for line in file]

file.close()
kmeans.run(X)
