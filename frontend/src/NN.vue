<template>
    <div>
        <h2 class="title is-size-3 mb-half">
            What others say about
        </h2>

        <div class="select">
            <select v-model="query">
                <option :value="value" v-for="(label, value) in queries">
                    {{ label }}
                </option>
            </select>
        </div>

        <NNBarChart :nn="filteredNN" />
    </div>
</template>

<script>
    import NNBarChart from './NNBarChart';

    export default {
        name: 'NN',
        components: {
            NNBarChart
        },
        props: {
            nn: {
                type: Array,
                required: true
            }
        },
        data() {
            const queries = {
                tast: 'Taste',
                palat: 'Palate',
                overal: 'Overall',
                aroma: 'Aroma',
                appear: 'Appearance',
                pour: 'Pour',
                bottl: 'Bottle',
                price: 'Price',
                color: 'Color',
                smell: 'Smell'
            };

            return {
                query: 'tast',
                queries: queries
            };
        },
        computed: {
            filteredNN() {
                return this.nn.filter(nn => nn.query === this.query);
            }
        }
    }
</script>