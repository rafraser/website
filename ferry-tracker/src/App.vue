<template>
    <div class="content">
        <div class="content-column" style="flex: 60">
            <FerryMap :ferries="ferryData"/>
        </div>

        <div class="content-column" style="flex: 40; overflow-y: scroll;">
            <FerryData :ferry="ferry.vehicle" :key="ferry.id" v-for="ferry in ferryData"/>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FeedMessage, FeedEntity } from './gen/gtfs-realtime_pb';
import FerryData from './components/FerryData.vue';
import FerryMap from './components/FerryMap.vue';
import { ref } from 'vue';

const ferryData = ref(null);
const positionsEndpoint = 'http://192.168.86.51:4000'

const ferryPrefixes = ['UQSL', 'NHAM']
// const ferryPrefixes = ['IPCA', 'CAIP']

function isFerry(entity: FeedEntity): boolean {
    if (!entity.vehicle) return false;
    if (!entity.vehicle.trip) return false;

    return ferryPrefixes.some((prefix) => entity.vehicle.trip.routeId.startsWith(prefix))
}

async function updateFerriesData() {
    const response = await fetch(positionsEndpoint)
    const dataBytes = new Uint8Array(await response.arrayBuffer())
    const feed = FeedMessage.fromBinary(dataBytes)

    const ferries = feed.entity.filter(isFerry)
    ferryData.value = ferries
    console.log('updating ferries!')

    setTimeout(() => { updateFerriesData().then() }, 5000)
}

updateFerriesData().then()
</script>

<style>
body {
    margin: 0;
}

.content {
    display: flex;
    height: 100vh;
}
</style>