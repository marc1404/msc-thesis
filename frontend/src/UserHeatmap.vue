<style scoped>
    .map {
        width: 100%;
        height: 200px;
    }
</style>

<template>
    <div ref="map" class="map"></div>
</template>

<script>
    import googleMaps from '~/src/googleMaps';
    import apiService from '~/src/apiService';

    export default {
        name: 'UserHeatmap',
        props: {
            userId: {
                type: Number,
                required: true
            }
        },
        data() {
            return {
                locations: []
            };
        },
        methods: {
            async loadLocations() {
                this.locations = await apiService.userLocations(this.userId);
            }
        },
        async mounted() {
            await Promise.all([
                googleMaps,
                this.loadLocations()
            ]);

            const mapElement = this.$refs.map;
            const map = new google.maps.Map(mapElement, {
                zoom: 1,
                center: {
                    lat: 48.1046255,
                    lng: 4.1838313
                }
            });

            new google.maps.visualization.HeatmapLayer({
                data: this.locations.map(location => new google.maps.LatLng(location.latitude, location.longitude)),
                map: map
            });
        }
    };
</script>