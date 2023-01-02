<template>
    <div class="ferry-details">
        <h1>{{ tidyName }}</h1>
        <h2 v-if="getFerryGeneration(tidyName) != '?'">{{ getFerryGeneration(tidyName) }}</h2>
        <h2>{{ getTransitStatus(props.ferry.currentStatus, props.ferry.stopId) }}</h2>
        <h3>{{ props.ferry.trip.routeId }}</h3>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { sanitizeName, getFerryGeneration, getTransitStatus } from '../ferries'
const props = defineProps(["ferry"])

const tidyName = computed(() => {
    return sanitizeName(props.ferry.vehicle.label)
})
</script>

<style>
.ferry-details {
    font-family: sans-serif;
    border-radius: 16px;
    padding: 8px;
    margin: 8px 0;
    background: #ecf0f1;
    color: #2c3e50;
}

.ferry-details h1 {
    margin: 0;
    font-size: 2em;
}

.ferry-details h2 {
    margin: 0;
    font-size: 1.25em;
}

.ferry-details h3 {
    margin: 2px;
}
</style>