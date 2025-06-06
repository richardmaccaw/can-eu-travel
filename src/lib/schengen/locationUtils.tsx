export function parseLatLon(geoString: string): [number, number] {
    const [lat, lon] = geoString.replace("geo:", "").split(",").map(Number);
    return [lat, lon];
}
