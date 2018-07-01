from dotenv import load_dotenv
import os

load_dotenv(dotenv_path='.env')

beer_id = os.getenv('BEER_ID')


def file_len(file):
    count = 0
    for line in file:
        count += 1
    return count


with open(f'models/{beer_id}/starspace.tsv', 'r') as input, open(f'models/{beer_id}/starspace.txt', 'w') as output:
    line_count = file_len(input)
    dimensions = 100
    output.write(' '.join([str(line_count), str(dimensions)]) + '\n')
    for line in input:
        words = line.strip().split()
        output.write(' '.join(words) + '\n')
