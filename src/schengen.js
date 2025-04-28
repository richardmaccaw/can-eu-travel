// schengen.js
// Future: Functions for geofencing, date calculations, and Schengen logic.

import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point, feature } from '@turf/helpers';
import { msToUTCmidnight } from './utils.js';


// You will need to implement or import loadSchengen
let schengenCache = null;
export async function loadSchengen() {
  if (schengenCache) return schengenCache;
  const resp = await fetch('schengen.geo.json');
  if (!resp.ok) throw new Error('Failed to load Schengen borders');
  schengenCache = await resp.json();
  return schengenCache;
}

export async function isSchengen(lat, lon) {
  const poly = feature((await loadSchengen()).geometry);
  return booleanPointInPolygon(point([lon, lat]), poly);
}

export async function collectSchengenDays(visits) {
  const days = new Set();
  for (const v of visits) {
    if (!(await isSchengen(v.lat, v.lon))) continue;
    for (let t = msToUTCmidnight(v.startMs); t <= v.endMs; t += 86_400_000) {
      days.add(t);
    }
  }
  return days;
}

export function windowStats(dayList, todayMidnight) {
  const WINDOW = 180;
  const LIMIT  = 90;
  let start = 0, used = 0;
  for (let end = 0; end < dayList.length; end++) {
    while (dayList[end] - dayList[start] > (WINDOW - 1) * 86_400_000)
      start++;
    if (dayList[end] <= todayMidnight)
      used = end - start + 1;
  }
  return {
    used,
    left: LIMIT - used,
    windowStart: todayMidnight - (WINDOW - 1) * 86_400_000
  };
} 