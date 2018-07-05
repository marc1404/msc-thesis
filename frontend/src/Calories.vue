<style scoped>
    .progress.is-unhealthy-0::-webkit-progress-value {
        background-color: #4575b4 !important;
    }

    .progress.is-unhealthy-1::-webkit-progress-value {
        background-color: #74add1 !important;
    }

    .progress.is-unhealthy-2::-webkit-progress-value {
        background-color: #abd9e9 !important;
    }

    .progress.is-unhealthy-3::-webkit-progress-value {
        background-color: #e0f3f8 !important;
    }

    .progress.is-unhealthy-4::-webkit-progress-value {
        background-color: #ffffbf !important;
    }

    .progress.is-unhealthy-5::-webkit-progress-value {
        background-color: #fee090 !important;
    }

    .progress.is-unhealthy-6::-webkit-progress-value {
        background-color: #fdae61 !important;
    }

    .progress.is-unhealthy-7::-webkit-progress-value {
        background-color: #f46d43 !important;
    }

    .progress.is-unhealthy-8::-webkit-progress-value {
        background-color: #d73027 !important;
    }

    .is-relative {
        position: relative;
    }

    .average-marker {
        position: absolute;
        height: 16px;
        border-left: 1px solid #363636;
        left: 50%;
    }

    .row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
</style>

<template>
    <div>
        <strong>Calories:</strong>

        {{ calories }}

        <div class="is-relative">
            <div class="average-marker"></div>
            <progress class="progress" :class="progressClass" :value="caloriesPercent" max="100"></progress>
        </div>

        <div class="row is-size-7 has-text-grey">
            <span>less calories</span>
            <span>avg.</span>
            <span>unhealthy</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Calories',
        props: {
            calories: {
                type: Number,
                required: true
            }
        },
        data() {
            return {
                average: 191.1918
            };
        },
        computed: {
            max() {
                return Math.round(this.average * 2);
            },
            caloriesPercent() {
                const { calories } = this;
                const percent = Math.round(calories / this.max * 100);

                if (percent > 100) {
                    return 100;
                }

                return percent;
            },
            progressClass() {
                let classNumber = Math.round(8 * this.caloriesPercent / 100);

                return `is-unhealthy-${classNumber}`;
            }
        }
    };
</script>