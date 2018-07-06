<style scoped>
    .embedding-select {
        position: fixed;
        top: 0;
        right: 0;
    }

    .back-button {
        position: fixed;
        top: 0;
        left: 0;
    }

    .is-borderless {
        border: none;
    }

    .subtitle {
        font-weight: normal;
        font-size: 1rem;
    }
</style>

<template>
    <div class="columns" v-if="!isLoading">
         <button type="button" class="button back-button is-borderless" @click="$router.go(-1)">
             <i class="fi fi-caret-left"></i>
             Back
         </button>

        <div class="select embedding-select">
            <select v-model="embedding" class="is-borderless">
                <option :key="embedding.key" v-for="embedding in embeddings" :value="embedding">
                    {{ embedding.name }}
                </option>
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
                <h2 class="title is-size-3 mb-half">
                    Reviews

                    <span class="subtitle is-weight-normal">
                        Automatically selected by
                        <a rel="noopener" :href="embedding.url">
                            {{ embedding.name }}
                        </a>
                    </span>
                </h2>

                <Review :key="review.id" :review="review" :beerRating="beer.averageRating" v-for="review in sortedReviews" />
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
                            <a rel="noopener" :href="beer.style.url">
                                {{ beer.style.name }}
                            </a>
                        </div>
                        <div v-if="beer.abv">
                            <strong>
                                {{ beer.abv }}%
                            </strong>
                            alcohol
                        </div>
                    </section>

                    <section class="mb-1" v-if="beer.ibu">
                        <IBU :ibu="beer.ibu" />
                    </section>

                    <section class="mb-1" v-if="beer.calories">
                        <Calories :calories="beer.calories" />
                    </section>

                    <section class="mb-1">
                        <Tags :tags="beer.tags" />
                    </section>

                    <section class="mb-1">
                        <h2 class="title is-size-3 mb-half">
                            Average Rating
                        </h2>

                        <RatingRadarChart
                            :datasets="[beer.averageRating]"
                        />
                    </section>
                </div>
                <div class="column has-text-centered">
                    <img :src="beer.image" :alt="beer.name">
                </div>
            </div>

            <section class="mb-1">
                <NN :nn="filteredNN" :embedding="embedding" />
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
    import embeddings, { starSpace } from '~/src/embeddings';
    import IBU from '~/src/IBU';
    import Calories from '~/src/Calories';
    import RatingRadarChart from '~/src/RatingRadarChart';

    export default {
        name: 'Beer',
        components: {
            Review,
            Places,
            NN,
            Rating,
            Tags,
            IBU,
            Calories,
            RatingRadarChart
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
                embedding: starSpace,
                embeddings: embeddings
            };
        },
        computed: {
            filteredReviews() {
                return this.reviews.filter(review => review.embedding === this.embedding.key);
            },
            sortedReviews() {
                return this.filteredReviews.sort((a, b) => b.user.ratings - a.user.ratings);
            },
            filteredNN() {
                return this.nn.filter(nn => nn.embedding === this.embedding.key);
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