import { createApp } from 'vue'
import App from './App.vue'
import type { Map } from 'mapbox-gl'

declare global {
  interface Window { mapGL: Map; }
}

import './theme.css'

createApp(App).mount('#app')
