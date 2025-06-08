export interface Stats {
  used: number
  left: number
  windowStart: number
}

// Placeholder stats for demo purposes only
export const sampleStats: Stats = {
  used: 50,
  left: 50,
  windowStart: Date.now() - 180 * 86400000 // Placeholder window start
}

// Placeholder days set for demo purposes only
export const sampleDaysSet = new Map<number, { name: string; emoji: string }>()

const today = new Date()
const start = new Date(today)
start.setDate(start.getDate() - 180)

const countryData: Record<string, { name: string; emoji: string }> = {
  CountryA: { name: 'Country A', emoji: '🤷' },
  CountryB: { name: 'Country B', emoji: '🤷' },
  CountryC: { name: 'Country C', emoji: '🤷' }
}

function addTrip(startOffset: number, length: number, country: keyof typeof countryData) {
  for (let i = 0; i < length; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + startOffset + i)
    const utcMid = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    sampleDaysSet.set(utcMid, countryData[country])
  }
}

addTrip(10, 10, 'CountryA')
addTrip(50, 5, 'CountryB')
addTrip(100, 7, 'CountryC')
