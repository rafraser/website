import argparse
import json


def convert_3031_coordinate_to_scaled_4326(t):
    """
    3031 Projected bounds:
    -3299207.53 -3333134.03
    3299207.53 3333134.03

    3857 Projected bounds:
    -20037508.34 -20048966.1
    20037508.34 20048966.1

    We want to scale 3031 coordinates to 3857 coordinates (eg -3299207 => -20037508)
    Then we convert these 3857 coordinates to 4326 lat/lons

    This data can then be passed through Tippecanoe to "trick" it
    """

    # Convert 3031 X to 3857 X
    x_width_a = 3299207.53 - -3299207.53
    x_width_m = 20037508.34 - -20037508.34
    y_width_a = -3333134.03 - 3333134.03
    y_width_m = 20048966.1 - -20048966.1

    # TODO: Check the offset on these, I'm a little nervous still
    # - -3299207.53
    # - -3333134.03
    x = (t[0]) * (x_width_m / x_width_a)
    y = (t[1]) * (y_width_m / y_width_a)

    # Convert to lat and lon!
    return (x, y)


def convert_3031_to_scaled_4326_multipolygon(geometry):
    coordinates = [[[convert_3031_coordinate_to_scaled_4326(c) for c in ring] for ring in polygon]
                   for polygon in geometry["coordinates"]]
    return {"type": "MultiPolygon", "coordinates": coordinates}


def convert_3031_to_scaled_4326_polygon(geometry):
    coordinates = [[convert_3031_coordinate_to_scaled_4326(c) for c in ring] for ring in geometry["coordinates"]]
    return {"type": "MultiPolygon", "coordinates": coordinates}


def convert_3031_to_scaled_4326_geometry(geometry):
    # TODO: Convert to match statement when I update Python in WSL
    if geometry["type"] == "MultiPolygon":
        return convert_3031_to_scaled_4326_multipolygon(geometry)
    elif geometry["type"] == "Polygon":
        return convert_3031_to_scaled_4326_polygon(geometry)
    else:
        print("Encountered", geometry["type"])
        raise NotImplementedError()


def convert_3031_to_scaled_4326_feature(feature):
    feature["geometry"] = convert_3031_to_scaled_4326_geometry(feature["geometry"])
    return feature


def convert_3031_to_scaled_4326_features(features):
    return [convert_3031_to_scaled_4326_feature(f) for f in features]


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("file")
    args = parser.parse_args()

    input_file = args.file
    output_file = args.file.replace("_3031.geojson", "_3857.geojson")
    with open(input_file) as f:
        geojson = json.load(f)
        geojson["crs"] = {"type": "name", "properties": {
            "name": "urn:ogc:def:crs:EPSG::3857"
        }}
        geojson["features"] = convert_3031_to_scaled_4326_features(geojson["features"])

        with open(output_file, "w") as f:
            json.dump(geojson, f)
