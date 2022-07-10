tippecanoe -e powerplants -zg powerplants.geojson

# Upload
aws s3 cp --recursive "powerplants/" "s3://rafraser-assets/tiles/powerplants/" --include "*/*/*.pbf" --content-encoding "gzip"
aws s3 cp "powerplants/metadata.json" "s3://rafraser-assets/tiles/powerplants/metadata.json" --include "*/*/*.pbf" --content-encoding "gzip"