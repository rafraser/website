import { reactive } from 'vue'
import { addFireflyLayers, removeFireflyLayers } from './fireflies';

export const choices = reactive({
  "tf2": { name: "Team Fortress 2", color: "#ff7f00", source: "./20230210_440_servers.geojson", active: false, count: 0 },
  "gmod": { name: "Garry's Mod", color: "#1f78b4", source: "./20230212_4000_servers.geojson", active: false, count: 0 },
  "baro": { name: "Barotrauma", color: "#33a02c", source: "./20230212_602960_servers.geojson", active: false, count: 0 },
  "css": { name: "Counter-Strike: Source", color: "#e31a1c", source: "./20230212_240_servers.geojson", active: false, count: 0 },
  "l4d2": { name: "Left 4 Dead 2", color: "#b2df8a", source: "./20230212_550_servers.geojson", active: false, count: 0 },
  "pz": { name: "Project Zomboid", color: "#cab2d6", source: "./20230212_108600_servers.geojson", active: false, count: 0 },
} as Record<string, any>)

export async function getGameServers(game: string) {
  if (!choices[game]) return {};

  const response = await fetch(choices[game].source)
  const servers = await response.json()

  const serverCount = servers.features.reduce((acc: number, feature: any) => acc + feature.properties.count, 0)
  choices[game].count = serverCount
  return servers
}