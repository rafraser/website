<template>
    <div class="big-text-container">
        <h1>{{ choices[props.game].name }}</h1>
        <h2>{{ choices[props.game].count }} servers</h2>
    </div>
</template>

<script setup>
import { choices } from './games';

const props = defineProps(["game"]);
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

.big-text-container {
    position: fixed;
    bottom: 32px;
    left: 8px;
    font-family: 'Bebas Neue', sans-serif;
}

.big-text-container h1, .big-text-container h2 {
    margin: 0;
    color: #fafafa;
    text-shadow: 2px 4px 0 #525252;
}

.big-text-container h1 {
    font-size: 3em;
    letter-spacing: 0.075em;
}

.big-text-container h2 {
    margin-top: -0.4em;
    font-size: 2em;
    letter-spacing: 0.05em;
}
</style>