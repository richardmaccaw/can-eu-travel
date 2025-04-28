// fileHandler.js
// Functions for parsing Google Timeline exports, extracting visits, etc.

export function parseFile(file) {
  // Placeholder for file parsing logic
  console.log('Parsing file:', file.name);
}

export function parseLatLon(geoString) {
  const [lat, lon] = geoString.replace('geo:', '').split(',').map(Number);
  return [lat, lon];
}

export function* timelineToFixes(timelineArray) {
  for (const entry of timelineArray) {
    if (!entry.visit) continue;
    const { startTime, endTime, visit } = entry;
    const geo = visit.topCandidate.placeLocation;
    const [lat, lon] = parseLatLon(geo);
    yield {
      startMs: Date.parse(startTime),
      endMs:   Date.parse(endTime),
      lat,
      lon
    };
  }
} 