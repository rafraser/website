# Energy Globe

## Introduction

Recently, [Mapbox Globe](https://www.mapbox.com/blog/globe-view) was released.

The World Resources Institude releases an [open dataset of global power plants](https://datasets.wri.org/dataset/globalpowerplantdatabase).
I thought that this would be a really fun dataset to explore, and an international dataset like this seems like a perfect match to experiment with Globe view!

## Dataset Processing

The processing for this dataset is pretty simple - essentially just converting a .csv to a .geojson. This can all be found in `processing.ipynb`

If I had a bit more time, I'd tile the output data. However, the finalised geojson is simple enough that the tiling isn't all that important.

## Future Work

I'm pretty happy with the end result here! However, there's more work that could still be done:

- Graph capacity vs. generation
- Click on values in the legend to filter them out

## Building

Pass MAPBOX_API_KEY as an environment variable and run the build script.

```bash
MAPBOX_API_KEY=<KEY HERE> npm run build
```