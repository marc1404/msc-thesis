def file_len(file):
    count = 0
    for line in file:
        count += 1
    return count


with open('models/starspace.tsv', 'r') as input, open('models/starspace.txt', 'w') as output:
    line_count = file_len(input)
    dimensions = 100
    output.write(' '.join([line_count, dimensions]) + '\n')
    for line in input:
        words = line.strip().split()
        output.write(' '.join(words) + '\n')
