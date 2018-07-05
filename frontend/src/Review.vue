<template>
    <div class="box">
        <div class="header mb-half is-size-larger">
            <span>
                <strong>
                    {{ review.user.name }}
                </strong>
                <span class="tag is-rounded is-light">
                    <strong>
                        {{ ratingsFormatted }}
                    </strong>
                    &nbsp;
                    reviews
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
                    {{ review.user.name }}'s Rating
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
                    Where {{ review.user.name }} is active
                </strong>

                <UserHeatmap :userId="review.user.id" />

            </div>
        </div>
    </div>
</template>

<script>
    import RatingRadarChart from './RatingRadarChart';
    import UserHeatmap from './UserHeatmap';
    import numeral from 'numeral';

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
        },
        computed: {
            ratingsFormatted() {
                return numeral(this.review.user.ratings).format('0a');
            }
        }
    };
</script>