import { queryMasterServer, queryGameServerInfo, REGIONS } from 'steam-server-query'
import { promises as fs } from 'fs'

const APP_ID = process.argv[2];
const now = new Date().toISOString().slice(0, 10).replace(/-/g, "");

queryMasterServer('hl2master.steampowered.com:27011', REGIONS.ALL, { appid: APP_ID }).then(async (results) => {
    console.log('Found', results.length, 'servers')
    await fs.writeFile(`${now}_${APP_ID}_servers.json`, JSON.stringify(results))
})