import { load } from '@loaders.gl/core';
import { LASLoader } from '@loaders.gl/las';
import { COORDINATE_SYSTEM, Deck, OrbitView } from '@deck.gl/core/typed';
import { PointCloudLayer } from '@deck.gl/layers/typed';
import { colorForClassification, colorForIntensity } from './color';

interface ViewOptions {
  forceIntensityView? : boolean
}

// Store a raw copy of the file that we load in
// This makes it a little easier for me to switch some styles at runtime
let lastLoadedData : any;

async function loadAndDisplayFile(url: string) {
  lastLoadedData = await load(url, LASLoader);
  console.log('loaded!', lastLoadedData);

  updatePointCloudDisplay({ forceIntensityView: true })
}

function updatePointCloudDisplay(options: ViewOptions) {
  const layer = createPointCloudLayer(lastLoadedData, options);
  const newViewState = calculateNewViewState(lastLoadedData);
  deckgl.setProps({ initialViewState: newViewState, layers: [layer] });
}
(window as any).updatePointCloudDisplay = updatePointCloudDisplay;


function createPointCloudLayer(data: any, options: ViewOptions) {
  // Super inefficient - can we do this better?
  if (data.attributes.COLOR && !options.forceIntensityView) {
    // Already have color - pass!

  } else if (data.attributes.classification && !options.forceIntensityView) {
    // Calculate a categorical colour scheme from the classification code
    const colorData = [] as number[];
    (data.attributes.classification.value as Uint16Array).forEach((value) => {
      const color = colorForClassification(value)
      colorData.push(...color)
    })
    data.attributes.COLOR = { size: 3, value: Uint8Array.from(colorData) }

  } else if (data.attributes.intensity) {
    // Calculate a gradient colour scheme from the intensity
    const maxIntensity = (data.attributes.intensity.value as Uint16Array).reduce((acc, val) => val > acc ? val : acc)
    const colorData = [] as number[];
    (data.attributes.intensity.value as Uint16Array).forEach((value) => {
      const color = colorForIntensity(maxIntensity, value)
      colorData.push(...color)
    })
    data.attributes.COLOR = { size: 3, value: Uint8Array.from(colorData) }
  }

  // https://deck.gl/docs/api-reference/core/layer#data
  const deckData = {
    length: data.loaderData.pointsCount,
    attributes: {
      getPosition: data.attributes.POSITION,
      getColor: data.attributes.COLOR
    }
  }

  return new PointCloudLayer({
    id: 'point-cloud-layer',
    data: deckData,
    coordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
    pickable: false,
    pointSize: 1,
    getPosition: (point) => point.POSITION,
  })
}

function calculateNewViewState(data: any) {
  if (data?.loaderData?.mins && data?.loaderData?.maxs) {
    const mins = data.loaderData.mins
    const maxs = data.loaderData.maxs
    const target = [(mins[0] + maxs[0]) / 2, (mins[1] + maxs[1]) / 2, (mins[2] + maxs[2]) / 2]
    return { target, zoom: 0 }
  }
  return INITIAL_VIEW_STATE;
}

const INITIAL_VIEW_STATE = {
  target: [0, 0, 0],
  zoom: 0,
};

const deckgl = new Deck({
  views: new OrbitView({ near: 0.001, far: 10000 }),
  initialViewState: INITIAL_VIEW_STATE,
  controller: true,
  layers: []
})

loadAndDisplayFile('http://localhost:8000/test2.las')