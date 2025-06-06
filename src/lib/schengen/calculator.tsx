import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import { point } from '@turf/helpers'
import { msToUTCmidnight } from './dateUtils'
import { parseLatLon } from "./locationUtils";
import type { FeatureCollection, Feature, Polygon, MultiPolygon } from 'geojson'


type SchengenFeature = Feature<Polygon | MultiPolygon, Record<string, unknown>>
type SchengenCollection = FeatureCollection<Polygon | MultiPolygon, Record<string, unknown>>

let schengenCache: SchengenCollection | null = null

export async function loadSchengen(): Promise<SchengenCollection> {
    if (schengenCache) return schengenCache
    const resp = await fetch('schengen.geo.json')
    if (!resp.ok) throw new Error('Failed to load Schengen borders')
    schengenCache = await resp.json() as SchengenCollection
    return schengenCache
}

export async function getSchengenCountry(lat: number, lon: number): Promise<Record<string, unknown> | null> {
    const geoJson = await loadSchengen()
    const pt = point([lon, lat])
    const country = geoJson.features.find((c: SchengenFeature) => booleanPointInPolygon(pt, c))
    return country ? country.properties : null
}

export async function collectSchengenDays(visits: Iterable<Visit>): Promise<Map<number, Record<string, unknown>>> {
    const days = new Map<number, Record<string, unknown>>()
    for (const v of visits) {
        const country = await getSchengenCountry(v.lat, v.lon)
        if (!country) continue
        for (let t = msToUTCmidnight(v.startMs); t <= v.endMs; t += 86_400_000) {
            days.set(t, country)
        }
    }
    return days
}

export function windowStats(dayList: number[], todayMidnight: number = msToUTCmidnight(Date.now())) {
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

export interface Visit {
    startMs: number;
    endMs: number;
    lat: number;
    lon: number;
}

export interface TimelineEntry {
    startTime: string
    endTime: string
    visit?: {
        topCandidate: {
            placeLocation: string
        }
    }
}

export function* timelineToVisit(timelineArray: Iterable<TimelineEntry>): Generator<Visit> {
    for (const entry of timelineArray) {
        if (!entry.visit) continue;
        const { startTime, endTime, visit } = entry;
        const geo = visit.topCandidate.placeLocation;
        const [lat, lon] = parseLatLon(geo);
        yield {
            startMs: Date.parse(startTime),
            endMs: Date.parse(endTime),
            lat,
            lon
        };
    }
}
