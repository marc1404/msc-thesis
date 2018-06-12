import mysql.connector
import pickle

data = pickle.load(open('kmeans.pckl', 'rb'))
idx, closest = data

print('Connecting to MySQL database...')
config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'beerlytics'
}
cnx = mysql.connector.connect(**config)
cursor = cnx.cursor()
print('Done.')

file = open('train_ids.txt')
review_ids = [int(line) for line in file]

file.close()

for i, cluster in enumerate(idx):
    review_id = review_ids[i]
    is_centroid = i == closest[cluster]
    values = (int(review_id), 'word2vec', int(cluster), bool(is_centroid))
    
    cursor.execute("INSERT INTO review_clusters (review_id, embedding, cluster, is_centroid) VALUES (%s, %s, %s, %s);", values)

print('Closing MySQL connection...')
cnx.commit()
cursor.close()
cnx.close()
print('Done.')
