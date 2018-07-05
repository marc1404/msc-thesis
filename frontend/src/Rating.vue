<style scoped>
    .mr-1 {
        margin-right: 1rem;
    }

    .is-clickable {
        cursor: pointer;
    }
</style>

<template>
    <div class="is-clickable" @click="goToRatingsPage()">
        <span class="mr-1">
            <StarRating :rating="average" />
        </span>

        <span class="mr-1">
            <strong>Overall:</strong>
            {{ rating.overall }}/100
        </span>

        <strong>Style:</strong>
        {{ rating.style }}/100
    </div>
</template>

<script>
    import StarRating from './StarRating';

    export default {
        name: 'Rating',
        components: {
            StarRating
        },
        props: {
            average: {
                type: Number,
                required: true
            },
            rating: {
                type: Object,
                required: true
            }
        },
        methods: {
            goToRatingsPage() {
                window.location.href = 'https://www.ratebeer.com/ratingsqa.asp';
            }
        }
    };
</script>