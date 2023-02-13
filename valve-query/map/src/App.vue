<template>
  <div id="mapContainer" ref="mapContainer" :style="{ 'pointerEvents': puppetGame ? 'none' : 'auto' }"></div>
  <BigText :game="puppetGame" v-if="puppetGame"/>
  <Legend v-else/>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import mapbox from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Legend from './Legend.vue'
import BigText from './BigText.vue'
import { choices, getGameServers } from './games';
import { addFireflyLayers } from './fireflies';
import type mapboxgl from 'mapbox-gl';

const mapContainer = ref();
const puppetGame = ref(null as string|null);

onMounted(() => {
  const map = new mapbox.Map({
    accessToken: import.meta.env.VITE_MAPBOX_TOKEN,
    container: mapContainer.value,
    style: 'mapbox://styles/rafraser/cle0zrl4l000f01p5suqkc9os',
    maxPitch: 0,
    minZoom: 1
  })
  window.mapGL = map;

  // Check URL params - if we have a game in there, switch to that instead of displaying the legend
  // This serves as a 'puppet' mode for promo screenshots
  map.on('load', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gameParam = urlParams.get('game');
    if (gameParam !== null && Object.keys(choices).includes(gameParam)) {
      map.fitBounds([[-180, -90], [180, 90]])
      await handlePuppetGame(map, gameParam)
    }
  })
})

async function handlePuppetGame(map: mapboxgl.Map, game: string) {
  puppetGame.value = game;
  const servers = await getGameServers(game);
  map.addSource(game, { 'type': 'geojson', 'data': servers })
  addFireflyLayers(map, { source: game, color: choices[game].color });
}
</script>

<style>
html {
  height: 100%;
}

body {
  margin: 0;
  height: 100%;
}

#app {
  height: 100%;
  font-family: sans-serif;
}

#mapContainer {
  width: 100%;
  height: 100%;
  background-color: #1F1F1F;
}
</style>