export interface Stats {
  used: number
  left: number
  windowStart: number
}

export const sampleStats: Stats = {
  used: 66,
  left: 24,
  windowStart: Date.now() - 179 * 86400000
}

export const sampleDaysSet = new Map<number, { name: string; emoji: string }>()

const today = new Date()
const start = new Date(today)
start.setDate(start.getDate() - 180)

const countryData: Record<string, { name: string; emoji: string }> = {
  France: { name: 'France', emoji: '🇫🇷' },
  Germany: { name: 'Germany', emoji: '🇩🇪' },
  Italy: { name: 'Italy', emoji: '🇮🇹' },
  Spain: { name: 'Spain', emoji: '🇪🇸' },
  Netherlands: { name: 'Netherlands', emoji: '🇳🇱' },
  Austria: { name: 'Austria', emoji: '🇦🇹' }
}

function addTrip(startOffset: number, length: number, country: keyof typeof countryData) {
  for (let i = 0; i < length; i++) {
    const d = new Date(start)
    d.setDate(d.getDate() + startOffset + i)
    const utcMid = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
    sampleDaysSet.set(utcMid, countryData[country])
  }
}

addTrip(5, 7, 'France')
addTrip(30, 3, 'Germany')
addTrip(60, 8, 'Italy')
addTrip(100, 2, 'Spain')
addTrip(140, 5, 'Netherlands')
addTrip(170, 4, 'Austria')
