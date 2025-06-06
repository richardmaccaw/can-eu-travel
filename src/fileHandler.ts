export function parseLatLon(geoString: string): [number, number] {
  const [lat, lon] = geoString.replace('geo:', '').split(',').map(Number);
  return [lat, lon];
}

export interface VisitFix {
  startMs: number;
  endMs: number;
  lat: number;
  lon: number;
}

export function* timelineToFixes(timelineArray: any[]): Generator<VisitFix> {
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
