import gensim
from sklearn.cluster import KMeans

K = 5

print('Loading word2vec model...')
model = gensim.models.Word2Vec.load('model')
print('Done.')

word_vectors = model.wv.syn0
n_words = word_vectors.shape[0]
vec_size = word_vectors.shape[1]

print(n_words)
print(vec_size)

print('Starting k-means clustering...')
kmeans = KMeans(n_clusters=K, n_jobs=-1, random_state=0)
idx = kmeans.fit_predict(word_vectors)
print('Done.')

word_centroid_list = list(zip(model.wv.index2word, idx))
word_centroid_list_sort = sorted(word_centroid_list, key=lambda el: el[1], reverse=False)

file_out = open('kmeans.txt', 'w')

file_out.write('WORD\tCLUSTER_ID\n')

for word_centroid in word_centroid_list_sort:
    line = word_centroid[0] + '\t' + str(word_centroid[1]) + '\n'
    file_out.write(line)

file_out.close()