<template>
    <div class="box">
        <div class="header mb-half is-size-larger">
            <span>
                <strong>
                    {{ review.user.name }}
                </strong>
                <span class="tag is-rounded is-light">
                    {{ review.user.ratings }}
                </span>
            </span>

            <span class="has-text-grey">
                {{ review.timeAgo }} ago
            </span>
        </div>

        <p class="pre-line" v-html="review.text"></p>

        <hr>

        <RatingRadarChart
            :aroma="review.aroma"
            :appearance="review.appearance"
            :taste="review.taste"
            :palate="review.palate"
            :overall="review.overall"
        />
    </div>
</template>

<script>
    import RatingRadarChart from './RatingRadarChart';

    export default {
        name: 'Review',
        components: {
            RatingRadarChart
        },
        props: {
            review: {
                type: Object,
                required: true
            }
        }
    };
</script>