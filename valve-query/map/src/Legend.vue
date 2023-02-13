<template>
    <div class="legend">
        <p>Game Select</p>
        <div :key="key" class="legend-entry" v-for="(choice, key) in choices">
            <input @input="onInput" class="legend-color" :style="{ outlineColor: choice.color, accentColor: choice.color }" type="checkbox" :id="key" v-model="choice.active" />
            <label :for="key">{{ choice.name }}</label>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { choices, getGameServers } from './games';
import { addFireflyLayers, removeFireflyLayers } from './fireflies';
import type { Map } from 'mapbox-gl';

async function getSource(map: Map, name: string) {
    if (map.getSource(name)) {
        return name;
    }

    const servers = await getGameServers(name)
    map.addSource(name, { 'type': 'geojson', 'data': servers })
    return name
}

async function onInput(e: Event) {
    if (!e.currentTarget) return;
    if (!(e.currentTarget instanceof Element)) return;

    const layer = e.currentTarget.id;
    if (choices[layer].active) {
        removeFireflyLayers(window.mapGL, layer);
    } else {
        const sourceName = await getSource(window.mapGL, layer);
        addFireflyLayers(window.mapGL, { source: sourceName, color: choices[layer].color });
    }
}
</script>

<style>
.legend {
    position: fixed;
    bottom: 32px;
    right: 16px;

    background-color: #262626;
    color: #FAFAFA;
    padding: 0.5em;
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);

    display: flex;
    flex-direction: column;
}

.legend-color {
    outline: 2px solid white;

    display: inline-block;
    vertical-align: middle;
    box-sizing: border-box;
    width: 16px;
    height: 16px;
    margin-right: 0.5em;
}

.legend-entry {
    margin: 0.25em 0;
}

.legend p {
    margin: 0;
    margin-bottom: 0.25em;
}

.legend label {
    vertical-align: middle;
    line-height: 16px;
}
</style>