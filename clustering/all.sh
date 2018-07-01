#!/usr/bin/env bash

python keyed_vectors.py glove
python mysql_import.py glove

python keyed_vectors.py word2vec
python mysql_import.py word2vec

python keyed_vectors.py fasttext
python mysql_import.py fasttext

python keyed_vectors.py starspace
python mysql_import.py starspace