import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { point } from '@turf/helpers'
import { msToUTCmidnight } from './utils'
import type { VisitFix } from './fileHandler'

let schengenCache: any = null

export async function loadSchengen(): Promise<any> {
  if (schengenCache) return schengenCache
  const resp = await fetch('schengen.geo.json')
  if (!resp.ok) throw new Error('Failed to load Schengen borders')
  schengenCache = await resp.json()
  return schengenCache
}

export async function getSchengenCountry(lat: number, lon: number): Promise<any | null> {
  const geoJson = await loadSchengen()
  const pt = point([lon, lat])
  const country = geoJson.features.find((c: any) => booleanPointInPolygon(pt, c))
  return country ? country.properties : null
}

export async function collectSchengenDays(visits: Iterable<VisitFix>): Promise<Map<number, any>> {
  const days = new Map<number, any>()
  for (const v of visits) {
    const country = await getSchengenCountry(v.lat, v.lon)
    if (!country) continue
    for (let t = msToUTCmidnight(v.startMs); t <= v.endMs; t += 86_400_000) {
      days.set(t, country)
    }
  }
  return days
}

export function windowStats(dayList: number[], todayMidnight: number) {
  const WINDOW = 180
  const LIMIT = 90
  let start = 0, used = 0
  for (let end = 0; end < dayList.length; end++) {
    while (dayList[end] - dayList[start] > (WINDOW - 1) * 86_400_000) start++
    if (dayList[end] <= todayMidnight) used = end - start + 1
  }
  return {
    used,
    left: LIMIT - used,
    windowStart: todayMidnight - (WINDOW - 1) * 86_400_000
  }
}
