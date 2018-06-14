<style scoped>
    .map {
        width: 100%;
        height: 400px;
    }
</style>

<template>
    <div ref="map" class="map"></div>
</template>

<script>
    import googleMaps from '~/src/googleMaps';

    export default {
        name: 'PlacesMap',
        props: {
            places: {
                type: Array,
                required: true
            }
        },
        async mounted() {
            await googleMaps;

            const mapElement = this.$refs.map;
            const map = new google.maps.Map(mapElement, {
                zoom: 3,
                center: {
                    lat: 52.3546274,
                    lng: 4.8285839
                }
            });
        }
    };
</script>