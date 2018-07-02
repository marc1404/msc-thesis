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
            <section class="mb-1">
                <h1 class="title is-size-1 is-marginless">
                    {{ beer.name }}
                </h1>

                <div class="is-size-4">
                    <Rating :average="beer.average" :rating="beer.rating" />
                </div>
            </section>

            <section class="mb-1">
                <p class="is-size-5">
                    {{ beer.description }}
                </p>

                <p class="is-size-5">
                    Brewed by {{ beer.brewery }} in {{ beer.location }}.
                </p>
            </section>

            <section class="mb-1">
                <Review :key="review.id" :review="review" v-for="review in sortedReviews" />
            </section>
        </div>

        <div class="column is-4">
            <div class="columns">
                <div class="column">

                    <section class="mb-1">
                        <div>
                            <strong>
                                Style:
                            </strong>
                            {{ beer.style }}
                        </div>
                        <div v-if="beer.abv">
                            <strong>
                                {{ beer.abv }}%
                            </strong>
                            alcohol
                        </div>
                    </section>

                    <section class="mb-1" v-if="beer.ibu">
                        <strong>
                            <a rel="noopener" href="https://en.wikipedia.org/wiki/Beer_measurement#Bitterness">
                                IBU:
                            </a>
                        </strong>

                        {{ beer.ibu }}

                        <progress class="progress" :value="ibuPercent" max="100"></progress>
                    </section>

                    <section class="mb-1" v-if="beer.calories">
                        <strong>Calories:</strong>

                        {{ beer.calories }}

                        <progress class="progress" :value="caloriesPercent" max="100"></progress>
                    </section>

                    <section class="mb-1">
                        <Tags :tags="beer.tags" />
                    </section>
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
    <div class="is-size-1" v-else>
        <i class="fi fi-spinner-refresh fi-spin"></i>
        Loading...
    </div>
</template>

<script>
    import distanceInWordsToNow from 'date-fns/distance_in_words_to_now';
    import apiService from '~/src/apiService';
    import Review from '~/src/Review';
    import Places from '~/src/Places';
    import NN from '~/src/NN';
    import Rating from '~/src/Rating';
    import Tags from '~/src/Tags';

    export default {
        name: 'Beer',
        components: {
            Review,
            Places,
            NN,
            Rating,
            Tags
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
            },
            ibuPercent() {
                const { ibu } = this.beer;

                if (!ibu) {
                    return 0;
                }

                const percent = Math.round(ibu / 300 * 100);

                if (percent > 100) {
                    return 100;
                }

                return percent;
            },
            caloriesPercent() {
                const { calories } = this.beer;

                if (!calories) {
                    return 0;
                }

                const percent = Math.round(calories / 1000 * 100);

                if (percent > 100) {
                    return 100;
                }

                return percent;
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
            this.isLoading = true;
            const { id } = this.$route.params;

            this.loadReviews(id).catch(error => console.error(error));
            this.loadPlaces(id).catch(error => console.error(error));
            this.loadNN(id).catch(error => console.error(error));

            await this.loadBeer(id);

            this.isLoading = false;
        }
    };
</script>