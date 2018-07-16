<style scoped>
    .back-button {
        position: fixed;
        top: 0;
        left: 0;
    }
</style>

<template>
    <div>

        <button type="button" class="button back-button is-borderless" @click="$router.go(-1)">
            <i class="fi fi-caret-left"></i>
            Back
        </button>

        <h1 class="title is-size-1 is-marginless">Recommended for you
            <span class="is-size-1" v-if="isLoading">
                <i class="fi fi-spinner-refresh fi-spin"></i>
            </span>
        </h1>

        <div class="panel">
            <nuxt-link class="panel-block" :key="beer.id" :to="`/beer/${beer.id}`" v-for="(beer, index) in beers">
                <span class="icon">
                    {{ index + 1 }}
                </span>

                <span class="row">
                    <span>
                        <strong>
                            {{ beer.name }}
                        </strong>
                    </span>
                </span>
                <!-- <div class="buttons has-addons is-pulled-right">
                    <span @click="toggle_like(beer)" class="button" v-bind:class="{ 'has-background-success': beer.liked }">Like</span>
                    <span @click="toggle_dislike(beer)" class="button" v-bind:class="{ 'has-background-danger': beer.disliked }">Dislike</span>
                </div> -->
            </nuxt-link>
        </div>
    </div>
</template>

<script>
    import apiService from '~/src/apiService';
    import recService from '~/src/recService';
    import StarRating from '~/src/StarRating';

    export default {
        name: 'Recommendation',
        data() {
            return {
                isLoading: false,
                params: {},
                liked: [],
                disliked: [],
                ranking: [],
                beers: []
            };
        },
        created() {
            this.liked = this.$route.params.liked;
            this.disliked = this.$route.params.disliked;
        },
        methods: {
            async recommend() {
                this.isLoading = true;

                try {
                    this.ranking = await recService.recommend(this.liked, this.disliked);
                    for (const id of this.ranking) {
                        var beer = await this.loadBeer(id)
                        beer.id = parseInt(id)
                        beer.rating = beer.rating != null ? beer.rating : 0
                        this.beers.push(beer);
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    this.isLoading = false;
                    console.log(this.ranking, this.beers)
                }
            },
            async loadBeer(id) {
                const beer = await apiService.beer(id);
                return beer;
            },
        },
        async mounted() {
            await this.recommend();
        }
    }
</script>
