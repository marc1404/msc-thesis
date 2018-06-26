import keyed_vectors
import mysql_helper
import sys

beer_id = 2360
embedding = sys.argv[1]

cnx, cursor = mysql_helper.connect()
model = keyed_vectors.load()
queries = ['tast', 'palat', 'overal', 'aroma', 'appear', 'pour', 'bottl', 'price', 'color', 'smell']

for query in queries:
    results = model.most_similar(query)

    for result in results:
        neighbor, similarity = result
        statement = "INSERT INTO beer_nn (beer_id, embedding, query, neighbor, similarity) VALUES (%s, %s, %s, %s, %s) ON DUPLICATE KEY UPDATE similarity = %s;"
        values = (beer_id, embedding, query, neighbor, similarity, similarity)

        cursor.execute(statement, values)

mysql_helper.disconnect(cnx, cursor)
