import maplibregl from 'maplibre-gl';
import style from './style.json';
import 'maplibre-gl/dist/maplibre-gl.css';
import './index.css';

window.map = new maplibregl.Map({
  container: 'map',
  style: style,
  renderWorldCopies: false
});