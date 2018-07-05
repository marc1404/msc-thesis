<style scoped>
    .progress.is-bitter-0::-webkit-progress-value {
        background-color: #fff7f3 !important;
    }

    .progress.is-bitter-1::-webkit-progress-value {
        background-color: #fde0dd !important;
    }

    .progress.is-bitter-2::-webkit-progress-value {
        background-color: #fcc5c0 !important;
    }

    .progress.is-bitter-3::-webkit-progress-value {
        background-color: #fa9fb5 !important;
    }

    .progress.is-bitter-4::-webkit-progress-value {
        background-color: #f768a1 !important;
    }

    .progress.is-bitter-5::-webkit-progress-value {
        background-color: #dd3497 !important;
    }

    .progress.is-bitter-6::-webkit-progress-value {
        background-color: #ae017e !important;
    }

    .progress.is-bitter-7::-webkit-progress-value {
        background-color: #7a0177 !important;
    }

    .progress.is-bitter-8::-webkit-progress-value {
        background-color: #49006a !important;
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
        <strong>
            <a rel="noopener" href="https://en.wikipedia.org/wiki/Beer_measurement#Bitterness">
                IBU:
            </a>
        </strong>

        {{ ibu }}

        <span class="has-text-grey">
            (bitterness)
        </span>

        <div class="is-relative">
            <div class="average-marker"></div>
            <progress class="progress" :class="progressClass" :value="ibuPercent" max="100"></progress>
        </div>

        <div class="row is-size-7 has-text-grey">
            <span>less bitter</span>
            <span>avg.</span>
            <span>very bitter</span>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'IBU',
        props: {
            ibu: {
                type: Number,
                required: true
            }
        },
        data() {
            return {
                average: 41.1568
            };
        },
        computed: {
            max() {
                return Math.round(this.average * 2);
            },
            ibuPercent() {
                const { ibu } = this;
                const percent = Math.round(ibu / this.max * 100);

                if (percent > 100) {
                    return 100;
                }

                return percent;
            },
            progressClass() {
                let classNumber = Math.round(8 * this.ibuPercent / 100);

                return `is-bitter-${classNumber}`;
            }
        }
    };
</script>