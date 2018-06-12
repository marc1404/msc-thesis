./vocab_count -verbose 2 -max-vocab 100000 -min-count 10 < train.txt > vocab.txt
./cooccur -verbose 2 -symmetric 0 -window-size 10 -vocab-file vocab.txt -memory 8.0 -overflow-file tempoverflow < train.txt > cooccurrence.bin
./shuffle -verbose 2 -memory 8.0 < cooccurrence.bin > cooccurrence.shuf.bin
./glove -input-file cooccurrence.shuf.bin -vocab-file vocab.txt -save-file vectors -gradsq-file gradsq -verbose 2 -vector-size 100 -threads 16 -alpha 0.75 -x-max 100.0 -eta 0.05 -binary 2 -model 2