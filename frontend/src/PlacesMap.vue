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
    import markerClusterer from '~/src/markerClusterer';
    import infoWindowContent from '~/src/infoWindowContent';

    function getGoogleMapsLocation(place) {
        return {
            lat: parseFloat(place.latitude),
            lng: parseFloat(place.longitude)
        };
    }

    export default {
        name: 'PlacesMap',
        props: {
            places: {
                type: Array,
                required: true
            }
        },
        async mounted() {
            await Promise.all([
                googleMaps,
                markerClusterer
            ]);

            const mapElement = this.$refs.map;
            const map = new google.maps.Map(mapElement, {
                zoom: 1,
                center: {
                    lat: 0,
                    lng: 0
                }
            });
            const infoWindow = new google.maps.InfoWindow();
            const markers = this.places.map(place => {
                const position = getGoogleMapsLocation(place);
                const marker = new google.maps.Marker({
                    position: position
                });

                google.maps.event.addListener(marker, 'click', () => {
                    const content = infoWindowContent(place);

                    infoWindow.setContent(content);
                    infoWindow.setPosition(position);
                    infoWindow.open(map);
                    this.$emit('place', place);
                });

                return marker;
            });
            const clustererOptions = {
                zoomOnClick: true,
                imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
            };

            new MarkerClusterer(map, markers, clustererOptions);

            google.maps.event.addListener(infoWindow, 'closeclick',() => this.$emit('place', null));
        }
    };
</script>