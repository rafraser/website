import argparse
import os
import pandas
import requests
import schedule
import time

# Feed URLs for the regions I'm interested in
GBFS_FEEDS = {
    "brisbane-neuron": "https://mds-global-bne.neuron-mobility.com/gbfs/2/",
    "christchurch-flamingo": "https://api.flamingoscooters.com/gbfs/christchurch/gbfs.json",
    "christchurch-neuron": "https://mds-global-chc.neuron-mobility.com/gbfs/2/",
    "dunedin-neuron": "https://mds-global-dud.neuron-mobility.com/gbfs/2/",
    "melbourne-neuron": "https://mds-global-mel.neuron-mobility.com/gbfs/2/",
    "perth-neuron": "https://mds-global-per.neuron-mobility.com/gbfs/2/",
}


class DiscoveryFeed():
    def __init__(self, data: dict):
        # this will bite me if I ever process non-en feeds...
        # GBFS has a bunch of feed types, but I'm only interested in plotting bike locations
        # Note down the free bike status & vehicle types feed URLs
        for feed in data["data"]["en"]["feeds"]:
            if feed["name"] == "free_bike_status":
                self.free_bike_status = feed["url"]
            elif feed["name"] == "vehicle_types":
                self.vehicle_types = feed["url"]


class VehicleTypesFeed():
    def __init__(self, data):
        self.vehicle_types = {}
        for vehicle_data in data["data"]["vehicle_types"]:
            vehicle = VehicleType(vehicle_data)
            self.vehicle_types[vehicle.id] = vehicle

    def to_dict(self):
        return self.vehicle_types

    def to_mapping_dict(self):
        return {id: info.form_factor for (id, info) in self.vehicle_types.items()}


class VehicleType():
    def __init__(self, data):
        self.id = data["vehicle_type_id"]
        self.form_factor = data.get("form_factor", "bicycle")
        self.propulsion_type = data.get("propulsion_type", "electric")
        self.range = data.get("max_range_meters", 0)


class FreeBikeStatusFeed():
    def __init__(self, url, data):
        # This is the only feed we'll be checking repeatedly, so save the timestamps!
        self.url = url
        self.last_updated = data["last_updated"]
        self.ttl = data["ttl"]

        free_bikes = data["data"]["bikes"]
        self.free_bikes = [FreeBike(bike) for bike in free_bikes]

    def to_dataframe(self) -> pandas.DataFrame:
        return pandas.DataFrame([bike.to_dict() for bike in self.free_bikes])

    def save_to_csv(self, folder: str, vehicle_types: VehicleTypesFeed = None):
        path = os.path.join(folder, str(self.last_updated) + ".csv")

        df = self.to_dataframe()
        df = df.rename(columns={"bike_id": "id", "vehicle_type_id": "vehicle_type"})
        if vehicle_types:
            df = df.replace({"vehicle_type": vehicle_types.to_mapping_dict()})
        df.to_csv(path, index=False)


class FreeBike():
    def __init__(self, data):
        self.id = data["bike_id"]
        self.lat = data["lat"]
        self.lon = data["lon"]
        self.vehicle_type_id = data.get("vehicle_type_id")
        self.reserved = data.get("is_reserved", False)
        self.disabled = data.get("is_disabled", False)
        self.current_range = data.get("current_range_meters", 0)
        self.battery_pct = data.get("battery_pct", 0)

    def to_dict(self):
        return {
            "bike_id": self.id,
            "lat": self.lat,
            "lon": self.lon,
            "vehicle_type_id": self.vehicle_type_id,
            "is_reserved": self.reserved,
            "is_disabled": self.disabled,
            "current_range_meters": self.current_range,
            "battery_pct": self.battery_pct
        }


def scrape_discovery_feed(url: str) -> DiscoveryFeed:
    resp = requests.get(url=url)
    data = resp.json()
    return DiscoveryFeed(data)


def scrape_vehicle_types_feed(url: str) -> VehicleTypesFeed:
    resp = requests.get(url=url)
    data = resp.json()
    return VehicleTypesFeed(data)


def scrape_free_bike_status_feed(url: str) -> FreeBikeStatusFeed:
    resp = requests.get(url=url)
    data = resp.json()
    return FreeBikeStatusFeed(url, data)


def download_free_bikes(output_dir: str, url: str, vehicle_types: VehicleTypesFeed):
    print("Fetching latest feed for", output_dir)
    free_bikes = scrape_free_bike_status_feed(url)
    free_bikes.save_to_csv(output_dir, vehicle_types)
    return free_bikes


def fetch_initial_feed_details(output_dir: str, key: str):
    discovery = scrape_discovery_feed(GBFS_FEEDS[key])
    if discovery.vehicle_types:
        vehicle_types = scrape_vehicle_types_feed(discovery.vehicle_types)

    free_bikes = download_free_bikes(output_dir, discovery.free_bike_status, vehicle_types)
    return (free_bikes, vehicle_types)


def setup_initial_jobs(output_root: str, key: str, loop: bool = False):
    # Ensure the output directory exists
    output_dir = os.path.join(output_root, key)
    os.makedirs(output_dir, exist_ok=True)

    # Fetch the initial feed details
    (free_bikes, vehicle_types) = fetch_initial_feed_details(output_dir, key)

    # Start in a loop if required
    if loop:
        def task():
            download_free_bikes(output_dir, free_bikes.url, vehicle_types)

        print("Starting download loop:", key)
        print("TTL:", free_bikes.ttl)
        schedule.every(free_bikes.ttl / 2).seconds.do(task)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Scrape micro-mobility locations from a GBFS provider.')
    parser.add_argument('feed', help='Feed name to scrape')
    parser.add_argument('--loop', action='store_true', help='Should the feed be continually scraped?')
    parser.add_argument('--output', default="output", help="Directory to save data to.")
    args = parser.parse_args()

    # Run in a job loop if required
    setup_initial_jobs(args.output, args.feed, args.loop)
    if args.loop:
        while True:
            schedule.run_pending()
            time.sleep(1)
