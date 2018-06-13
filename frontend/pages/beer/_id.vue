<template>
    <div>
        <h1 class="title">
            {{ beer.name }}
        </h1>
    </div>
</template>

<script>
    import apiService from '~/src/apiService';

    export default {
        name: 'Beer',
        head() {
            return {
                title: this.beer.name
            };
        },
        data() {
            return {
                beer: {},
                reviews: []
            };
        },
        methods: {
            async loadBeer(id) {
                this.beer = await apiService.beer(id);
            },
            async loadReviews(id) {
                this.reviews = await apiService.reviews(id);
            }
        },
        async mounted() {
            const { id } = this.$route.params;

            await Promise.all([
                this.loadBeer(id),
                //this.loadReviews(id)
            ]);
        }
    };
</script>