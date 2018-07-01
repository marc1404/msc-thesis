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

        <div class="columns">
            <div class="column">

                <strong class="is-size-larger">
                    Rating
                </strong>

                <RatingRadarChart
                        :aroma="review.aroma"
                        :appearance="review.appearance"
                        :taste="review.taste"
                        :palate="review.palate"
                        :overall="review.overall"
                />

            </div>
            <div class="column">

                <strong class="is-size-larger">
                    User Reviews Heatmap
                </strong>

                <UserHeatmap v-if="false" :userId="review.user.id" />

            </div>
        </div>
    </div>
</template>

<script>
    import RatingRadarChart from './RatingRadarChart';
    import UserHeatmap from './UserHeatmap';

    export default {
        name: 'Review',
        components: {
            RatingRadarChart,
            UserHeatmap
        },
        props: {
            review: {
                type: Object,
                required: true
            }
        }
    };
</script>