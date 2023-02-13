import type { Map } from 'mapbox-gl'

type FireflyOptions = {
  color?: string;
  size?: number;
  source?: string;
  scale?: number;
}

export function addFireflyLayers(map: Map, options: FireflyOptions = {}) {
  const color = options.color || 'orange';
  const size = options.size || 4;
  const source = options.source || 'fireflies';
  const scale = options.scale || 4;

  map.addLayer({
    'id': `${source}-fireflies-2`,
    'type': 'circle',
    'source': source,
    'paint': {
      'circle-opacity': 0.15,
      'circle-blur': 1,
      'circle-radius': ['interpolate', ['exponential', 0.5], ['zoom'], 5, size * 2, 12, size * 2 * scale],
      'circle-color': color
    }
  })

  map.addLayer({
    'id': `${source}-fireflies-1`,
    'type': 'circle',
    'source': source,
    'paint': {
      'circle-opacity': 0.4,
      'circle-blur': 1,
      'circle-radius': ['interpolate', ['exponential', 0.5], ['zoom'], 5, size, 12, size * scale],
      'circle-color': color
    }
  })

  map.addLayer({
    'id': `${source}-fireflies-0`,
    'type': 'circle',
    'source': source,
    'paint': {
      'circle-radius': 1,
      'circle-color': 'white'
    }
  })
}

export function removeFireflyLayers(map: Map, name: string) {
  map.removeLayer(`${name}-fireflies-2`)
  map.removeLayer(`${name}-fireflies-1`)
  map.removeLayer(`${name}-fireflies-0`)
}