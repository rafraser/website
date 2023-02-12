import { queryGameServerInfo } from 'steam-server-query'
queryGameServerInfo(process.argv[2]).then(console.log)