<style scoped>
    .mr-1 {
        margin-right: 1rem !important;
    }

    .blurred {
        /*
        color: transparent;
        text-shadow: 0 0 10px #363636;
        */
    }
</style>

<template>
    <div class="box">
        <div class="header mb-half is-size-larger">
            <span>
                <strong class="blurred">
                    {{ review.user.name }}
                </strong>
                <span class="tag is-rounded is-light">
                    <strong>
                        {{ ratingsFormatted }}
                    </strong>
                    &nbsp;
                    {{ reviewsWord }}
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
                <strong class="is-size-larger is-block">
                    <span class="blurred">{{ review.user.name }}</span>'s Rating
                </strong>

                <div>
                    <span class="mr-1">Compare with</span>

                    <label class="checkbox mr-1">
                        <input type="checkbox" v-model="includeAverageUserRating">
                        avg. user rating
                    </label>


                    <label class="checkbox">
                        <input type="checkbox" v-model="includeBeerRating">
                        beer rating
                    </label>
                </div>

                <RatingRadarChart :datasets="datasets" />
            </div>
            <div class="column">

                <strong class="is-size-larger">
                    Where <span class="blurred">{{ review.user.name }}</span> is active
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
            },
            beerRating: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                includeAverageUserRating: false,
                includeBeerRating: true
            };
        },
        computed: {
            ratingsFormatted() {
                return numeral(this.review.user.ratings).format('0a');
            },
            reviewsWord() {
                return this.review.user.ratings === 1 ? 'review' : 'reviews';
            },
            datasets() {
                const datasets = [
                    {
                        label: 'User Rating',
                        aroma: this.review.aroma,
                        appearance: this.review.appearance,
                        taste: this.review.taste,
                        palate: this.review.palate,
                        overall: this.review.overall
                    }
                ];

                if (this.includeAverageUserRating) {
                    datasets.push({
                        label: 'Avg. User Rating',
                        ...this.review.user.averageRating
                    });
                }

                if (this.includeBeerRating) {
                    datasets.push({
                        label: 'Beer Rating',
                        ...this.beerRating
                    });
                }

                return datasets;
            }
        }
    };
</script>