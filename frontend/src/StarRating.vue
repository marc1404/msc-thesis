<style scoped>
    .fi {
        margin-right: 0.2rem;
    }
</style>

<template>
    <span>
        <span class="has-text-warning">
            <i class="fi fi-star" v-for="star in stars"></i>
            <i class="fi fi-star-half" v-if="hasHalfStar"></i>
        </span>

        {{ displayRating }}
    </span>
</template>

<script>
    export default {
        name: 'StarRating',
        props: {
            rating: {
                type: Number,
                required: true
            }
        },
        computed: {
            stars() {
                return Math.floor(this.rating);
            },
            hasHalfStar() {
                const fraction = this.rating - Math.floor(this.rating);

                return fraction >= 0.5;
            },
            displayRating() {
                return this.rating.toFixed(1);
            }
        }
    };
</script>