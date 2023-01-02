const generations = {
  'Kurilpa': 1,
  'Mirbarpa': 1,
  'Barrambin': 1,
  'Tugulawa': 1,
  'Mianjin': 1,
  'Binkinba': 1,
  'Mooroolbin': 1,
  'Baneraba': 1,
  'Beenung-urrung': 2,
  'Tunamun': 2,
  'Meeandah': 2,
  'Wilwinpa': 2,
  'Ya-wa-gara': 2,
  'Mahreel': 2,
  'Kuluwin': 3,
  'Gootcha': 3,
  'Walan': 3,
  'Mudherri': 3,
  'Spirit Of Brisbane': 3,
  'Nar-dha': 3,
  'Gilwunpa': 3,
  'Yoogera': 4,
  'Neville Bonner': 4,
  'Kurilpa II': 4,
  'Kalparrin': 5,
  '': 6
} as Record<string, number>

/*
const stopNames = {
  307147: 'Apollo Road',
  317572: 'Guyatt Park',
  317574: 'West End',
  317575: 'South Bank 1',
  317576: 'South Bank 2',
  317578: 'Maritime Museum',
  317580: 'Holman Street',
  317582: 'Mowbray Park',
  317583: 'Hawthorne',
  317584: 'Bulimba',
  317587: 'Teneriffe',
  317588: 'New Farm Park',
  317589: 'Sydney Street',
  317590: 'Riverside',
  318002: 'Northshore Hamilton',
  319586: 'Milton',
  319637: 'QUT Gardens Point',
  319665: 'UQ St Lucia',
  319743: 'Bretts Wharf',
  321208: 'Howard Smith Wharves'
} as Record<number, string>
*/

import stopNames from './all_stops.json'

export function sanitizeName(name: string): string {
  // Strip any leading zeroes etc.
  let tidyName = name.replace(/^[0]+/, '')

  return tidyName.toLowerCase()
    .split(' ')
    .map((s) => {
      if (s == 'ii') {
        return 'II'
      } else {
        return s.charAt(0).toUpperCase() + s.substring(1)
      }
    }).join(' ')
}

export function getFerryGeneration(name: string): string {
  const generationNumber = generations[name];
  switch (generationNumber) {
    case 1:
      return 'First Generation'

    case 2:
      return 'Second Generation'

    case 3:
      return 'Third Generation'

    case 4:
      return 'Fourth Generation'

    case 5:
      return 'CityFerry'

    case 6:
      return 'KittyCat'

    default:
      return '?'
  }
}

export function getTransitStatus(statusCode: number, stopNumber: number): string {
  const name = stopNames[stopNumber] || new String(stopNumber)
  switch (statusCode) {
    case 0:
      return 'Arriving at ' + name

    case 1:
      return 'Stopped at ' + name

    default:
      return 'Heading to ' + name
  }
}