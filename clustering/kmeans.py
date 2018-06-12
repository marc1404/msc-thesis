from itertools import chain
from sklearn.cluster import KMeans
import numpy as np
from sklearn.metrics import pairwise_distances_argmin_min
import pickle

K = 3

def run(X):
    lengths = [len(vector) for vector in X]
    max_length = max(lengths)
    X = [np.pad(vector, (0, max_length - len(vector)), mode='constant') for vector in X]

    print('Running k-means...')
    kmeans = KMeans(n_clusters=K, n_jobs=-1, random_state=0)
    idx = kmeans.fit_predict(X)
    print('Done.')

    print('Finding cluster centroids...')
    closest, _ = pairwise_distances_argmin_min(kmeans.cluster_centers_, X)
    print('Done.')

    print(idx)
    print(closest)

    data = [idx, closest]

    pickle.dump(data, open('kmeans.pckl', 'wb'))
