import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { legendColors } from './legend.js';

mapboxgl.accessToken = process.env.MAPBOX_API_KEY;

const basemapStyles = {
    'light': 'mapbox://styles/mapbox/light-v10',
    'dark': 'mapbox://styles/mapbox/dark-v10',
    'streets': 'mapbox://styles/mapbox/streets-v11',
    'satellite': 'mapbox://styles/mapbox/satellite-v9'
}

// Build the expression for Mapbox
const styleColors = Object.entries(legendColors).reduce((acc, [key, value]) => {
    if (key == 'Other') return acc;
    return acc.concat([key, value]);
}, []);

export function createMap() {
    const map = new mapboxgl.Map({
        container: 'map',
        style: basemapStyles['light'],
        projection: 'globe'
    });

    map.once('style.load', () => { addPowerplantsData(map) } );
    return map;
}

function addPowerplantsData(map) {
    // Create the default atmosphere
    map.setFog({});

    // Load up our power plants
    map.addSource('powerplants', {
        type: 'vector',
        attribution: 'World Resources Institute',
        tiles: [
            'https://tiles.robertafraser.com/powerplants/{z}/{x}/{y}.pbf'
        ],
        minzoom: 0,
        maxzoom: 3,
    });

    map.addLayer({
        'id': 'powerplants-layer',
        'type': 'circle',
        'source': 'powerplants',
        'source-layer': 'powerplants',
        'paint': {
            'circle-radius': ['interpolate', ['linear'], ['zoom'], 3, 1, 5, 3, 8, 5, 10, 12],
            'circle-color': ['match', ['get', 'primary_fuel']].concat(styleColors).concat(['#a6cee3']),
        }
    });
}

export function changeBasemapStyle(map, style) {
    const newBasemapUrl = basemapStyles[style];
    if (!newBasemapUrl) return;

    map.setStyle(newBasemapUrl);
    map.once('style.load', () => { addPowerplantsData(map) } );
}