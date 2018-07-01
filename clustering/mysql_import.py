import pickle
import sys
import mysql_helper

embedding = sys.argv[1]
data = pickle.load(open('kmeans.pckl', 'rb'))
idx, closest = data

print(idx, closest)

cnx, cursor = mysql_helper.connect()
file = open('data/train_ids.txt')
review_ids = [int(line) for line in file]

file.close()

for i, cluster in enumerate(idx):
    review_id = review_ids[i]
    is_centroid = i == closest[cluster]
    values = (int(review_id), embedding, int(cluster), bool(is_centroid), int(cluster), bool(is_centroid))
    
    cursor.execute("INSERT INTO review_clusters (review_id, embedding, cluster, is_centroid) VALUES (%s, %s, %s, %s) ON DUPLICATE KEY UPDATE cluster = %s, is_centroid = %s;", values)

mysql_helper.disconnect(cnx, cursor)
