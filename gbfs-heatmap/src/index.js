import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.MAPBOX_API_KEY;

const basemapStyles = {
  light: 'mapbox://styles/mapbox/light-v10',
  dark: 'mapbox://styles/mapbox/dark-v10',
  streets: 'mapbox://styles/mapbox/streets-v11',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
};

const map = new mapboxgl.Map({
  container: 'map',
  style: basemapStyles.light,
  projection: 'globe',
});

map.once('load', () => {
  console.log('loaded');
});
