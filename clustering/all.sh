#!/usr/bin/env bash

python run_kmeans.py glove
python mysql_import.py glove

python run_kmeans.py word2vec
python mysql_import.py word2vec

python run_kmeans.py fasttext
python mysql_import.py fasttext

python run_kmeans.py starspace
python mysql_import.py starspace