import gensim
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path='.env')

beer_id = os.getenv('BEER_ID')
sentences = []
file = open(f'data/{beer_id}/train.txt')

for line in file:
    sentence = line.split()
    sentences.append(sentence)

model = gensim.models.Word2Vec(sentences, workers=4)

model.save(f'models/{beer_id}/word2vec')
