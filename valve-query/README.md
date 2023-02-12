# Valve Server Viewer

This project is a visualisation of server locations for various Steam games. There's a few mini-projects in this folder.

## Extracting Server Locations

`index.js` is a script which will extract all servers from the Valve master list, for a given App ID.

Usage:

```bash
node index.js <app id>
```

Server IP addresses will be saved to a .json file in the directory. To convert this into a GeoJSON:

```bash
node locations.js <filename>
```

This uses a free IP to location lookup service - the quality isn't the most reliable but it's free and that's what matters for this project.

## Map View

The map/ subdirectory is a simple Mapbox application for visualising these locations on a map. By default, it will show an interactive legend allowing layers to be switched on and off as required.

However, if a game is specified in the query params, it'll enter a non-interactive visual of that specific game. This leads into...

This is a simple Vite application, so to preview it:

```bash
npm run dev
```

## Puppetmaster Screenshots

The puppetmaster/ directory is a simple [Puppeteer](https://pptr.dev/) script to load the page and take some screenshots. This allows for consistent promotional screenshots.

To run:

```bash
node index.js
```
