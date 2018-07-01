<template>
    <div class="columns" v-if="!isLoading">
        <div class="select is-small" style="position: fixed; top: 0; right: 0">
            <select v-model="embedding" style="border: none">
                <option value="glove">GloVe</option>
                <option value="word2vec">word2vec</option>
                <option value="fasttext">fastText</option>
                <option value="starspace">StarSpace</option>
            </select>
        </div>

        <div class="column is-8">
            <h1 class="title is-size-1 mb-1">
                {{ beer.name }}
            </h1>

            <div class="field is-grouped mb-1">
                <div class="control">
                    <div class="tags has-addons">
                        <span class="tag is-dark is-medium">Style</span>
                        <span class="tag is-light is-medium">
                            {{ beer.style }}
                        </span>
                    </div>
                </div>

                <div class="control">
                    <div class="tags has-addons">
                        <span class="tag is-dark is-medium">Brewery</span>
                        <span class="tag is-light is-medium">
                            {{ beer.brewery }}
                        </span>
                    </div>
                </div>

                <div class="control">
                    <div class="tags has-addons">
                        <span class="tag is-dark is-medium">Location</span>
                        <span class="tag is-light is-medium">
                            {{ beer.location }}
                        </span>
                    </div>
                </div>
            </div>

            <p class="is-size-5 mb-1">
                {{ beer.description }}
            </p>

            <div class="mb-1">
                <h2 class="title is-size-3 mb-half">
                   Tags
                </h2>
                <div class="tags">
                    <span class="tag" v-for="tag in beer.tags">
                        {{ tag }}
                    </span>
                </div>
            </div>

            <div class="mb-1">
                <div class="header mb-half">
                    <h2 class="title is-size-3 is-marginless is-inline-block">
                        Reviews
                    </h2>

                </div>

                <Review :key="review.id" :review="review" v-for="review in sortedReviews" />
            </div>
        </div>

        <div class="column is-4">
            <div class="columns">
                <div class="column is-size-5">
                    <div v-if="beer.abv">
                        <strong>
                            {{ beer.abv }}%
                        </strong>
                        alcohol
                    </div>
                    <div v-if="beer.ibu">
                        <strong>
                            {{ beer.ibu}}
                        </strong>
                        <a rel="noopener" href="https://en.wikipedia.org/wiki/Beer_measurement#Bitterness">
                            <abbr title="Bitterness">IBU</abbr>
                        </a>
                    </div>
                    <div v-if="beer.calories">
                        <strong>
                            {{ beer.calories }}
                        </strong>
                        calories
                    </div>
                </div>
                <div class="column has-text-centered">
                    <img :src="beer.image" :alt="beer.name">
                </div>
            </div>

            <section class="mb-1">
                <NN :nn="filteredNN" />
            </section>

            <section class="mb-1">
                <Places :places="places" />
            </section>
        </div>
    </div>
</template>

<script>
    import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
    import apiService from '~/src/apiService';
    import Review from '~/src/Review';
    import Places from '~/src/Places';
    import NN from '~/src/NN';

    export default {
        name: 'Beer',
        components: {
            Review,
            Places,
            NN
        },
        head() {
            return {
                title: this.beer.name
            };
        },
        data() {
            return {
                isLoading: true,
                beer: {},
                reviews: [],
                places: [],
                nn: [],
                embedding: 'starspace'
            };
        },
        computed: {
            filteredReviews() {
                return this.reviews.filter(review => review.embedding === this.embedding);
            },
            sortedReviews() {
                return this.filteredReviews.sort((a, b) => b.user.ratings - a.user.ratings);
            },
            filteredNN() {
                return this.nn.filter(nn => nn.embedding === this.embedding);
            }
        },
        methods: {
            async loadBeer(id) {
                const beer = await apiService.beer(id);

                if (beer.abv) {
                    beer.abv = beer.abv.toFixed(1);
                }

                this.beer = beer;
            },
            async loadReviews(id) {
                const reviews = await apiService.reviews(id);

                for (const review of reviews) {
                    review.timeAgo = distanceInWordsToNow(review.date);
                    review.text = review.text
                        .trim()
                        .replace(/[\n]+/g, '\n')
                        .replace(/([a-z]+:)/gi, '<strong>$1</strong>');
                }

                this.reviews = reviews;
            },
            async loadPlaces(id) {
                this.places = await apiService.places(id);
            },
            async loadNN(id) {
                this.nn = await apiService.nn(id);
            }
        },
        async mounted() {
            this.$nextTick(() => this.$nuxt.$loading.start());

            const { id } = this.$route.params;

            await Promise.all([
                this.loadBeer(id),
                this.loadReviews(id),
                this.loadPlaces(id),
                this.loadNN(id)
            ]);

            this.isLoading = false;

            this.$nuxt.$loading.finish();
        }
    };
</script>