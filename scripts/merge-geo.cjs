const fs = require('fs');
const path = require('path');

(async function merge() {
  const geoDir = path.join(__dirname, 'geo');
  const outputFile = path.join(__dirname, '..', 'public', 'schengen.geo.json');
  const files = fs.readdirSync(geoDir).filter(f => f.endsWith('.geo.json'));
  const features = [];

  for (const file of files) {
    const filePath = path.join(geoDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    if (data.type !== 'FeatureCollection' || !Array.isArray(data.features)) {
      throw new Error(`Invalid GeoJSON in ${file}`);
    }
    features.push(...data.features);
  }

  fs.writeFileSync(outputFile, JSON.stringify({ type: 'FeatureCollection', features }));
  console.log(`Merged ${files.length} files into ${outputFile}`);
})();

