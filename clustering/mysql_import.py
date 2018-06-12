import mysql.connector
import pickle
import sys
from dotenv import load_dotenv
import os

load_dotenv()

embedding = sys.argv[1]
data = pickle.load(open('kmeans.pckl', 'rb'))
idx, closest = data

print(idx, closest)

print('Connecting to MySQL database...')
config = {
    'host': os.getenv('MYSQL_HOST'),
    'user': os.getenv('MYSQL_USER'),
    'password': os.getenv('MYSQL_PASSWORD'),
    'database': os.getenv('MYSQL_DATABASE')
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
    values = (int(review_id), embedding, int(cluster), bool(is_centroid), int(cluster), bool(is_centroid))
    
    cursor.execute("INSERT INTO review_clusters (review_id, embedding, cluster, is_centroid) VALUES (%s, %s, %s, %s) ON DUPLICATE KEY UPDATE cluster = %s, is_centroid = %s;", values)

print('Closing MySQL connection...')
cnx.commit()
cursor.close()
cnx.close()
print('Done.')
