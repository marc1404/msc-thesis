import kmeans

file = open('models/starspace.txt')
X = []

for i, line in enumerate(file):
    should_continue = i < 4 or i % 2 != 0

    if should_continue:
        continue
    
    vector = [float(chunk) for chunk in line.split()]

    X.append(vector)

kmeans.run(X)
