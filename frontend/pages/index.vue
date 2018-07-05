<style scoped>
    .mb-1 {
        margin-bottom: 1rem !important;
    }

    .row {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .star-rating {
        width: 120px;
    }
</style>

<template>
    <div>
        <h1 class="title is-size-1 mb-1">
            Beerlytics
        </h1>

        <div class="field mb-1">
            <div class="control is-large" :class="{ 'is-loading': isLoading }">
                <input type="search" class="input is-large is-rounded" v-model="query">
            </div>
        </div>

        <div class="panel">
            <nuxt-link :key="beer.id" :to="`/beer/${beer.id}`" class="panel-block" v-for="beer in sortedBeers">
                <span class="panel-icon">
                    <i class="fi" :class="getBeerIcon(beer)"></i>
                </span>

                <span class="row">
                    <span>
                        <strong>
                            {{ beer.name }}
                        </strong>

                        <span class="tag">
                            <strong>
                                {{ getRatingsFormatted(beer.ratings) }}
                            </strong>
                            &nbsp;
                            ratings
                        </span>
                    </span>

                    <span v-if="beer.rating" class="star-rating">
                        <StarRating :rating="beer.rating" />
                    </span>
                </span>
            </nuxt-link>
        </div>
    </div>
</template>

<script>
    import apiService from '~/src/apiService';
    import StarRating from '~/src/StarRating';
    import numeral from 'numeral';

    export default {
        name: 'Index',
        components: {
            StarRating
        },
        data() {
            return {
                beers: [],
                query: '',
                isLoading: false
            };
        },
        computed: {
            sortedBeers() {
                return this.beers.sort((a, b) => b.ratings - a.ratings);
            }
        },
        watch: {
            query: 'search'
        },
        methods: {
            getBeerIcon(beer) {
                return beer.isProcessed ? 'fi-checkbox-active' : 'fi-checkbox-passive';
            },
            getRatingsFormatted(ratings) {
                return numeral(ratings).format('0a');
            },
            async search() {
                this.isLoading = true;

                try {
                    this.beers = await apiService.search(this.query);
                } catch (error) {
                    console.error(error);
                } finally {
                    this.isLoading = false;
                }
            }
        },
        async mounted() {
            await this.search();
        }
    };
</script>