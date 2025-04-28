// schengen.js
// Functions for geofencing, date calculations, and Schengen logic.

import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';
import { msToUTCmidnight } from './utils.js';

// Cache for Schengen GeoJSON data
let schengenCache = null;

export async function loadSchengen() {
  if (schengenCache) return schengenCache;
  const resp = await fetch('schengen.geo.json');
  if (!resp.ok) throw new Error('Failed to load Schengen borders');
  schengenCache = await resp.json();
  return schengenCache;
}

export async function isSchengen(lat, lon) {
  const geoJson = await loadSchengen();
  const pt = point([lon, lat]);
  
  // Check if point is in any Schengen country
  return geoJson.features.some(country => 
    booleanPointInPolygon(pt, country)
  );
}

export async function getSchengenCountry(lat, lon) {
  const geoJson = await loadSchengen();
  const pt = point([lon, lat]);
  
  // Find which Schengen country the point is in
  const country = geoJson.features.find(country => 
    booleanPointInPolygon(pt, country)
  );
  
  return country ? country.properties : null;
}

export async function collectSchengenDays(visits) {
  const days = new Map();
  for (const v of visits) {
    const country = await getSchengenCountry(v.lat, v.lon);
    if (!country) continue;
    
    // Add each day from start to end (inclusive)
    for (let t = msToUTCmidnight(v.startMs); t <= v.endMs; t += 86_400_000) {
      days.set(t, country.name);
    }
  }
  return days;
}

export async function collectSchengenVisits(visits) {
  const schengenVisits = [];
  
  for (const visit of visits) {
    const country = await getSchengenCountry(visit.lat, visit.lon);
    if (!country) continue;
    
    schengenVisits.push({
      ...visit,
      country: country.name,
      iso: country.iso,
      schengenEntry: country.schengenEntry
    });
  }
  
  return schengenVisits;
}

export function windowStats(dayList, todayMidnight) {
  const WINDOW = 180;
  const LIMIT = 90;
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