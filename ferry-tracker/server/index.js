import fetch from 'node-fetch';
import express from 'express';

const app = express();
const port = 4000;

const GTFS_URL = 'https://gtfsrt.api.translink.com.au/api/realtime/SEQ/VehiclePositions';

app.get('/', async (req, res) => {
  const request = await fetch(GTFS_URL);
  const buffer = await request.buffer();
  console.log(buffer);

  res.set('Access-Control-Allow-Origin', '*');
  res.send(buffer);
});

app.listen(port, () => {
  console.log('Server started');
});
