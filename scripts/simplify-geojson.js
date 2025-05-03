const fs = require('fs');
const path = require('path');
const turf = require('@turf/turf');

if (!process.argv[2]) {
  console.log('Usage: node scripts/simplify-geojson.js <path-to-geojson> [tolerance]');
  process.exit(1);
}

const filePath = path.resolve(process.argv[2]);
const tolerance = process.argv[3] ? parseFloat(process.argv[3]) : 0.01; // Default tolerance

const original = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const simplified = turf.simplify(original, { tolerance, highQuality: false });

fs.writeFileSync(filePath, JSON.stringify(simplified, null, 2));

const originalSize = Buffer.byteLength(JSON.stringify(original));
const newSize = Buffer.byteLength(JSON.stringify(simplified));

console.log(`Simplified ${filePath}: ${originalSize} bytes -> ${newSize} bytes (tolerance: ${tolerance})`); 