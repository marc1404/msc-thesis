import gensim

model = gensim.models.Word2Vec.load('model')

print(model.most_similar('tast'))