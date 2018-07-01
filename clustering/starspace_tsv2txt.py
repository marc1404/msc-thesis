from dotenv import load_dotenv
import os

load_dotenv(dotenv_path='.env')

beer_id = os.getenv('BEER_ID')


def file_len(file):
    count = 0
    for line in file:
        count += 1
    return count


with open(f'models/{beer_id}/starspace.tsv', 'r') as input_file, open(f'models/{beer_id}/starspace.txt', 'w') as output_file:
    line_count = file_len(input_file)
    dimensions = 100
    input_file.seek(0)
    output_file.write(' '.join([str(line_count), str(dimensions)]) + '\n')
    for line in input_file:
        words = line.strip().split()
        output_file.write(' '.join(words) + '\n')
