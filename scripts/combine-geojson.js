const fs = require('fs');
const path = require('path');

// Directory containing country geojsons
const geoDir = path.join(__dirname, '../public/geo');

// Output file
const outputFile = path.join(__dirname, '../public/schengen.geo.json');

// Read all .geo.json files except schengen.geo.json
const files = fs.readdirSync(geoDir)
  .filter(f => f.endsWith('.geo.json') && f !== 'schengen.geo.json');

let allFeatures = [];

files.forEach(file => {
  const filePath = path.join(geoDir, file);
  const geojson = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (geojson.type === 'FeatureCollection') {
    allFeatures = allFeatures.concat(geojson.features);
  } else if (geojson.type === 'Feature') {
    allFeatures.push(geojson);
  } else {
    console.warn(`Unknown GeoJSON type in ${file}: ${geojson.type}`);
  }
});

const combined = {
  type: 'FeatureCollection',
  features: allFeatures
};

fs.writeFileSync(outputFile, JSON.stringify(combined, null, 2));
console.log(`Combined ${files.length} files into ${outputFile}`); 