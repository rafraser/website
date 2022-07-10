import './index.css';
import { createMap } from './map';
import { legendColors, createLegend } from './legend';
import { createChart, hideChart, updateChartData } from './chart';
import { buildPopup } from './popup';

const map = createMap();
const chart = createChart();
createLegend();

// Whenever the viewport is adjusted, change the chart in the top right corner
function viewportChanged() {
    if (!map.getLayer('powerplants-layer')) return;

    if (map.getZoom() > 6) {
        const features = map.queryRenderedFeatures({ layers: ['powerplants-layer'] });
        const powerTotals = calculatePowerTotals(features, 'capacity_mw');
        updateChartData(chart, powerTotals);
    } else {
        hideChart();
    }
}

function calculatePowerTotals(features, key) {
    // Default to 0 for each power type
    const results = Object.fromEntries(Object.keys(legendColors).map(key => [key, 0]))

    // Sum up all the power plants
    features.forEach((feature) => {
        const powerType = feature.properties.primary_fuel
        if (powerType in results) {
            results[powerType] = results[powerType] + feature.properties[key]
        } else {
            results['Other'] = results['Other'] + feature.properties[key]
        }
    });
    return Object.values(results);
}

map.on('dragend', viewportChanged);
map.on('zoomend', viewportChanged);

// Make a nice popup whenever a power plant is clicked on
map.on('click', 'powerplants-layer', (e) => {
    const feature = e.features[0];
    if (!feature) return;

    buildPopup(feature).addTo(map);
});

map.on('mouseenter', 'powerplants-layer', () => {
    map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'powerplants-layer', () => {
    map.getCanvas().style.cursor = '';
});