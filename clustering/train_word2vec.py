import gensim

sentences = []
file = open('data/train.txt')

for line in file:
    sentence = line.split()
    sentences.append(sentence)

model = gensim.models.Word2Vec(sentences, workers=4)

model.save('models/word2vec')