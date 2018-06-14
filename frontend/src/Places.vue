<template>
    <div>
        <h2 class="title is-size-3 mb-half">
            Places
        </h2>

        <PlacesMap class="mb-1" :places="places" @place="onPlace" />

        <Place v-if="place" :place="place" />
    </div>
</template>

<script>
    import PlacesMap from './PlacesMap';
    import Place from './Place';

    export default {
        name: 'Places',
        components: {
            PlacesMap,
            Place
        },
        props: {
            places: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                place: null
            };
        },
        methods: {
            onPlace(place) {
                this.place = place;
            }
        }
    };
</script>