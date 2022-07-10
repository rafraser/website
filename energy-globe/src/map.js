import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { legendColors } from './legend.js';

mapboxgl.accessToken = process.env.MAPBOX_API_KEY;

// Build the expression for Mapbox
const styleColors = Object.entries(legendColors).reduce((acc, [key, value]) => {
    if (key == 'Other') return acc;
    return acc.concat([key, value]);
}, []);

export function createMap() {
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10', // todo: custom style!
        projection: 'globe'
    });

    map.on('load', () => {
        // Create a basic atmosphere on load
        map.setFog({});

        // Load up our power plants
        map.addSource('powerplants', {
            type: 'geojson',
            data: './powerplants.geojson'
        });

        map.addLayer({
            'id': 'powerplants-layer',
            'type': 'circle',
            'source': 'powerplants',
            'paint': {
                'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 1, 5, 3, 8, 5, 10, 12],
                'circle-color': ['match', ['get', 'primary_fuel']].concat(styleColors).concat(['#a6cee3']),
            }
        });
    });

    return map;
}