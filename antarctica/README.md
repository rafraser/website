# Antarctica Map

This folder is the result of a lengthy experiment to visualise Antarctica using vector tile styles.

The problem: Mapbox/Maplibre/most web mapping tools are locked to the classic Web Mercator projection. This is fine, but has a few limitations - most notably, that it only goes down as far as about 85 degrees south latitude. This is problematic when trying to map Antarctica.

The solution: Trickery. [EPSG:3031](https://epsg.io/3031) Antarctic Polar Stereographic produces a roughly square projection. We can rescale these coordinates to fit [EPSG:3857](https://epsg.io/3857) Web Mercator bounds. From there, we can work with our usual web mapping workflows.

### Tech Summary

- [QGIS](https://qgis.org/en/site/) for initial data cleansing
- My horrific Python script for 3031 to 3857 transforms
- [Tippecanoe](https://github.com/felt/tippecanoe) for generating vector tiles
- [PMTiles](https://protomaps.com/docs/pmtiles) for final tile hosting format + serverless code
- [Maputnik](https://maputnik.github.io/) for a quick vector tile style mockup
- [Maplibre](https://maplibre.org/) for the map viewer

## Processing

My key takeaway from the process is that the *order of operations* is very important. Clipping the data in 4326 before transforming to 3031 *will* go horribly wrong.

It's also important to clip the data to the projection, even though QGIS appears to handle it fine. Having geometries escape the bounds of the final map will bite in the tiling stage.

- 1: Load [Natural Earth](https://www.naturalearthdata.com/) data into QGIS.
- 2: Run some cleanup operations to ensure geometry is valid (very important!)
- 3: Reproject to EPSG:3031. **This needs to be done before we crop the data.**
- 4: Mark out the world bounds in EPSG:3031.
- 5: Clip the data
- 6: Save as a 3031 file
- 7: Run through the Python script to get scaled 3857 coordinates
- 8: Use Tippecanoe to convert to vector tiles
- 9: Celebrate
