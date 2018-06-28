<template>
    <canvas ref="canvas"></canvas>
</template>

<script>
    import Chart from 'chart.js';

    export default {
        name: 'NNBarChart',
        props: {
            nn: {
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
            sortedNN() {
                return this.nn.sort((a, b) => b.similarity - a.similarity);
            },
            chartData() {
                return this.sortedNN.map(nn => nn.similarity)
            },
            chartLabels() {
                return this.sortedNN.map(nn => nn.neighbors[0])
            }
        },
        watch: {
            chartData(chartData) {
                const { chart } = this;

                if (!chart) {
                    return;
                }

                chart.data.datasets[0].data = chartData;

                chart.update();
            },
            chartLabels(chartLabels) {
                const { chart } = this;

                if (!chart) {
                    return;
                }

                chart.data.labels = chartLabels;

                chart.update();
            }
        },
        mounted() {
            const backgroundColor = 'hsl(217, 71%, 53%, 50%)';
            const color = 'hsl(217, 71%, 53%)';
            const ctx = this.$refs.canvas;
            const data = {
                labels: this.chartLabels,
                datasets: [{
                    backgroundColor: backgroundColor,
                    borderColor: color,
                    borderWidth: 1,
                    data: this.chartData
                }]
            };
            const options = {
                legend: false,
                scales: {
                    xAxes: [{
                        ticks: {
                            max: 1,
                            display: false
                        }
                    }]
                },
                tooltips: false,
                hover: {
                    mode: null
                }
            };

            this.chart = new Chart(ctx, {
                type: 'horizontalBar',
                data: data,
                options: options
            });
        }
    };
</script>