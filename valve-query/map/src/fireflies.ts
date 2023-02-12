export function addFireflyLayers(map, options={}) {
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

export function removeFireflyLayers(map, source) {
  map.removeLayer(`${source}-fireflies-2`)
  map.removeLayer(`${source}-fireflies-1`)
  map.removeLayer(`${source}-fireflies-0`)
}