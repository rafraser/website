<template>
    <div id="mapContainer" ref="mapContainer"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { sanitizeName } from '../ferries';
import mapbox from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'

const props = defineProps(['ferries']);
const mapContainer = ref();
let map = null;

onMounted(() => {
    map = new mapbox.Map({
        accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
        container: mapContainer.value,
        style: 'mapbox://styles/mapbox/streets-v12',
        zoom: 13,
        center: [153.02, -27.47]
    })

    map.on('load', () => {
        map.addSource('ferries', { type: 'geojson', data: null });
        map.loadImage('./ship.png', (error, image) => {
            console.log(error, image)
            map.addImage('anchor', image, { 'sdf': true })
        })

        map.addLayer({
            id: 'ferry-glow',
            type: 'circle',
            source: 'ferries',
            paint: {
                'circle-blur': 1,
                'circle-radius': 32,
                'circle-color': '#f0932b',
            }
        })

        map.addLayer({
            id: 'ferry-circle',
            type: 'circle',
            source: 'ferries',
            paint: {
                'circle-radius': 12,
                'circle-color': 'white',
                'circle-stroke-color': '#f0932b',
                'circle-stroke-width': 4
            }
        })

        map.addLayer({
            id: 'ferry-icon',
            type: 'symbol',
            source: 'ferries',
            paint: {
                'icon-color': '#f0932b'
            },
            layout: {
                'icon-image': 'anchor',
                'icon-size': 0.25,
                'icon-offset': [0, -2],
                'icon-allow-overlap': true,
                'icon-anchor': 'center'
            }
        })

        map.addLayer({
            id: 'ferry-label',
            type: 'symbol',
            source: 'ferries',
            layout: {
                'text-field': ['get', 'name'],
                'text-variable-anchor': ['bottom'],
                'text-radial-offset': 1.5,
                'text-font': ['Open Sans Semibold'],
                'text-size': 14,
            },
            paint: {
                'text-halo-width': 1,
                'text-halo-color': 'white',
                'text-color': 'black'
            }
        })

        updateFerrySource(props.ferries)
    })
})

function updateFerrySource(ferries) {
    const source = map.getSource('ferries')
    if (!source) return;

    const ferryFeatures = ferries.map((ferry) => {
        return {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [
                    ferry.vehicle.position.longitude,
                    ferry.vehicle.position.latitude
                ]
            },
            'properties': {
                'name': sanitizeName(ferry.vehicle.vehicle.label),
            }
        }
    })

    const data = {
        'type': 'FeatureCollection',
        'features': ferryFeatures
    }
    source.setData(data)
}

watch(() => props.ferries, () => {
    updateFerrySource(props.ferries);
})
</script>

<style scoped>
#mapContainer {
    width: 100%;
    height: 100%;
}
</style>