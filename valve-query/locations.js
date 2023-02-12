import { promises as fs } from 'fs'

async function holdOn(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time)
    })
}

async function queryServerLocations(addresses) {
    return new Promise(async (resolve, reject) => {
        const response = await fetch('http://ip-api.com/batch?fields=lat,lon,query', {
            method: 'POST',
            body: JSON.stringify(addresses)
        })

        const data = await response.json()
        resolve(data)
    })
}

function countIPs(addresses) {
    const counts = new Map()
    addresses.forEach((address) => {
        const base = address.split(":")[0]
        counts.set(base, (counts.get(base) || 0) + 1)
    })

    return counts
}

const fileName = process.argv[2]

fs.readFile(fileName).then(async (dataString) => {
    const data = JSON.parse(dataString)
    const counts = countIPs(data)

    const uniqueIPs = [...counts.keys()]
    const chunkSize = 100
    let features = []

    for (let i = 0; i < uniqueIPs.length; i += chunkSize) {
        const chunk = uniqueIPs.slice(i, i + chunkSize)
        const locations = await queryServerLocations(chunk)

        const locationFeatures = locations.map((data) => {
            return {
                "type": "Feature",
                "geometry": {
                    "type": "Point",
                    "coordinates": [data.lon, data.lat],
                },
                "properties": {
                    "count": counts.get(data.query),
                    "ip": data.query
                }
            }
        })
        features = features.concat(locationFeatures)
        console.log('Processed', features.length)
        await holdOn(5000)
    }
    await fs.writeFile(fileName.replace(".json", ".geojson"), JSON.stringify({ "type": "FeatureCollection", features: features }))
})


