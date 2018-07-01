<style scoped>
    .mr-1 {
        margin-right: 1rem;
    }
</style>

<template>
    <div>
        <span class="mr-1">
            <StarRating :rating="average" />
        </span>

        <span class="mr-1">
            <strong>Overall:</strong>
            {{ rating.overall }}
        </span>

        <strong>Style:</strong>
        {{ rating.style }}
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
        }
    };
</script>