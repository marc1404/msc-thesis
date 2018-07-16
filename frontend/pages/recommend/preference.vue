<style scoped>
    .beer-img {
        max-height: 100px;
        height: auto;
        width: auto;
        max-width: 50px;
        vertical-align: middle;
    }
    .beer-title {
        font-size: 1rem;
    }
    .card {
        display:flex;
        flex-direction: column;
        height: 200px;
        overflow: hidden;
    }
    .card-footer {
        margin-top: auto;
    }
    #fixedButton {
        position: fixed;
        bottom: 30px;
        right: 30px;
    }
</style>

<template>
    <div>
        <div class="field mb-1">
            <div class="control is-large" :class="{ 'is-loading': isLoading }">
                <input type="search" class="input is-large is-rounded" v-model="query">
            </div>
        </div>

        <div class="container is-fluid">
            <div class="columns is-multiline">
                <div class="column is-one-quarter" v-for="beer in beers">
                    <div class="card">
                        <div class="card-content">
                            <div class="media">
                                <div class="media-left">
                                    <figure class="image">
                                        <img class="beer-img" :src="beer.image" alt="Beer image">
                                    </figure>
                                </div>
                                <div class="media-content">
                                    <p class="title is-5 beer-title">
                                        {{ beer.name }}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <footer class="card-footer">
                            <div @click="toggle_like(beer)" class="card-footer-item" v-bind:class="{ 'has-background-success': beer.liked }">
                                <span>
                                    <i class="fi fi-like"></i>
                                </span>
                                Like
                            </div>
                            <div @click="toggle_dislike(beer)" class="card-footer-item" v-bind:class="{ 'has-background-danger': beer.disliked }">
                                Dislike
                                <span>
                                    <i class="fi fi-dislike"></i>
                                </span>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        </div>
        <nuxt-link :to="{ name: 'recommend-recommendation', params: { liked: this.liked, disliked: this.disliked }}" id="fixedButton" class="button is-medium is-info is-rounded">
            <span>Recommend</span>
        </nuxt-link>
    </div>
</template>

<script>
    import apiService from '~/src/apiService';

    export default {
        name: 'Preferences',
        data() {
            return {
                beers: [],
                query: '',
                isLoading: false,
                liked: [],
                disliked: []
            };
        },
        watch: {
            query: 'search'
        },
        methods: {
            async search() {
                this.isLoading = true;

                try {
                    this.beers = await apiService.search(this.query);
                    var i;
                    for (i in this.beers) {
                        this.beers[i].liked = this.liked.includes(this.beers[i].id)
                        this.beers[i].disliked = this.disliked.includes(this.beers[i].id)
                    }
                } catch (error) {
                    console.error(error);
                } finally {
                    this.isLoading = false;
                }
            },
            toggle_like(item) {
                item.liked = !item.liked;
                if (item.liked == item.disliked) {
                    this.toggle_dislike(item)
                }
                if (item.liked) {
                    this.liked.push(item.id)
                }
                else {
                    this.liked = this.liked.filter(id => id !== item.id);
                }
            },
            toggle_dislike(item) {
                item.disliked = !item.disliked;
                if (item.liked == item.disliked) {
                    this.toggle_like(item)
                }
                if (item.disliked) {
                    this.disliked.push(item.id)
                }
                else {
                    this.disliked = this.disliked.filter(id => id !== item.id);
                }
            },
        },
        async mounted() {
            await this.search();
        }
    }
</script>
