<template>
    <canvas ref="canvas"></canvas>
</template>

<script>
    import Chart from 'chart.js';

    const colors = [
        {
            backgroundColor: 'hsl(217, 71%, 53%, 50%)',
            borderColor: 'hsl(217, 71%, 53%)',
            pointBackgroundColor: 'hsl(217, 71%, 53%, 50%)',
            pointBorderColor: 'hsl(217, 71%, 53%)',
        },
        {
            backgroundColor: 'hsl(48, 100%, 67%, 50%)',
            borderColor: 'hsl(48, 100%, 67%)',
            pointBackgroundColor: 'hsl(48, 100%, 67%, 50%)',
            pointBorderColor: 'hsl(48, 100%, 67%)',
        },
        {
            backgroundColor: 'hsl(348, 100%, 61%, 50%)',
            borderColor: 'hsl(348, 100%, 61%)',
            pointBackgroundColor: 'hsl(348, 100%, 61%, 50%)',
            pointBorderColor: 'hsl(348, 100%, 61%)',
        }
    ];

    export default {
        name: 'RatingRadarChart',
        props: {
            datasets: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                chart: null
            };
        },
        computed: {
            transformedDatasets() {
                let colorIndex = 0;

                return this.datasets.map(dataset => {
                    return {
                        label: dataset.label,
                        ...colors[colorIndex++],
                        data: [
                            Math.round(dataset.aroma / 10 * 10),
                            Math.round(dataset.appearance / 5 * 10),
                            Math.round(dataset.taste / 10 * 10),
                            Math.round(dataset.palate / 5 * 10),
                            Math.round(dataset.overall / 20 * 10)
                        ]
                    };
                });
            }
        },
        watch: {
            transformedDatasets(datasets) {
                const { chart } = this;

                if (!chart) {
                    return;
                }

                chart.data.datasets = datasets;

                chart.update();
            }
        },
        mounted() {
            const ctx = this.$refs.canvas;
            const data = {
                labels: ['Aroma', 'Appearance', 'Taste', 'Palate', 'Overall'],
                datasets: this.transformedDatasets
            };
            const options = {
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

            if (this.datasets.length === 1) {
                options.legend = false;
            }

            this.chart = new Chart(ctx, {
                type: 'radar',
                data: data,
                options: options
            });
        }
    };
</script>