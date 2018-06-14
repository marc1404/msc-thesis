<template>
    <canvas ref="canvas"></canvas>
</template>

<script>
    import Chart from 'chart.js';

    export default {
        name: 'RatingRadarChart',
        props: {
            aroma: {
                type: Number,
                required: true
            },
            appearance: {
                type: Number,
                required: true
            },
            taste: {
                type: Number,
                required: true
            },
            palate: {
                type: Number,
                required: true
            },
            overall: {
                type: Number,
                required: true
            },
        },
        computed: {
            data() {
                return [
                    Math.round(this.aroma / 10 * 10),
                    Math.round(this.appearance / 5 * 10),
                    Math.round(this.taste / 10 * 10),
                    Math.round(this.palate / 5 * 10),
                    Math.round(this.overall / 20 * 10)
                ];
            }
        },
        mounted() {
            const backgroundColor = 'hsl(217, 71%, 53%, 50%)';
            const color = 'hsl(217, 71%, 53%)';
            const ctx = this.$refs.canvas;
            const data = {
                labels: ['Aroma', 'Appearance', 'Taste', 'Palate', 'Overall'],
                datasets: [{
                    backgroundColor: backgroundColor,
                    borderColor: color,
                    pointBackgroundColor: backgroundColor,
                    pointBorderColor: color,
                    data: this.data
                }]
            };
            const options = {
                legend: false,
                scale: {
                    ticks: {
                        beginAtZero: true,
                        max: 10
                    }
                },
                tooltips: {
                    displayColors: false
                }
            };

            new Chart(ctx, {
                type: 'radar',
                data: data,
                options: options
            });
        }
    };
</script>