const fs = require('fs');

const mapsJsPath = 'js/maps.js';
const generatedPath = 'generated_map.txt';

let mapsJs = fs.readFileSync(mapsJsPath, 'utf8');
const generatedMap = fs.readFileSync(generatedPath, 'utf8');

// The mridula_bhawan definition starts at "mridula_bhawan: {" and ends before "mhow_highway: {"
const startIndex = mapsJs.indexOf('mridula_bhawan: {');
const endIndex = mapsJs.indexOf('mhow_highway: {');

if (startIndex === -1 || endIndex === -1) {
    console.error('Could not find map boundaries in maps.js');
    process.exit(1);
}

// Replace the old definition with the new one
const newMapsJs = mapsJs.substring(0, startIndex) + generatedMap + '\n        ' + mapsJs.substring(endIndex);

fs.writeFileSync(mapsJsPath, newMapsJs);
console.log('Successfully patched maps.js with the new Mridula Bhawan map!');
