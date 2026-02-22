const fs = require('fs');

const W = 60;
const H = 25;
const ground = [];
const objects = [];

for (let y = 0; y < H; y++) {
    ground[y] = '';
    objects[y] = '';
    for (let x = 0; x < W; x++) {
        let g = 'G', o = '.';

        // Ground
        if (y >= 4 && y <= 6) g = '3'; // sidewalk top
        else if (y >= 7 && y <= 10) g = '7'; // parking
        else if (y >= 11 && y <= 20) {
            if (y === 15 && x % 4 < 2) g = '2'; // road line dashed
            else g = '1';
        }
        else if (y >= 21 && y <= 22) g = '3'; // sidewalk bottom
        else if (y >= 23) g = 'G'; // grass

        ground[y] += g;
        objects[y] += o;
    }
}

function drawObj(x, y, str) {
    if (y >= 0 && y < H) {
        let arr = objects[y].split('');
        for (let i = 0; i < str.length; i++) {
            if (x + i < W) arr[x + i] = str[i];
        }
        objects[y] = arr.join('');
    }
}
function drawObjRow(y, char) {
    objects[y] = char.repeat(W);
}

// Boundaries
drawObjRow(0, '9');

// Buildings (Y=4 to 5). Door MUST be at (5, 5) for shogo!
drawObj(2, 4, '44444');
drawObj(2, 5, '44d44');

drawObj(10, 4, '5555555');
drawObj(10, 5, '55d5555');

drawObj(22, 4, 'VVVVV');
drawObj(22, 5, 'VQVdV');

drawObj(32, 4, '444444');
drawObj(32, 5, '44d004');

// Boundary wall on the right
drawObj(42, 4, '999999999999999999');
drawObj(42, 5, '999999999999999999');

// Large trees and vegetation
function drawTreeCluster(cx, cy) {
    drawObj(cx, cy, 'TTT');
    drawObj(cx + 1, cy - 1, 'T');
    drawObj(cx + 1, cy + 1, 'T');
}

drawTreeCluster(2, 1);
drawTreeCluster(15, 1);
drawTreeCluster(30, 2);
drawTreeCluster(45, 1);
drawTreeCluster(55, 1);

// Lush Trees shading the sidewalk
for (let i = 2; i < 58; i += 6) {
    if (Math.random() > 0.2) {
        drawObj(i, 6, Math.random() > 0.6 ? 'C' : 'T'); // Sakura or Tree
    }
}

// Scooters built along the sidewalk / parking
drawObj(10, 8, '8');
drawObj(14, 8, '8');
drawObj(25, 8, '8');
drawObj(33, 8, '@'); // Car
drawObj(40, 8, '@');

// Hydrants or pylons on bottom sidewalk
for (let i = 5; i < 55; i += 8) {
    drawObj(i, 21, '!');
}

// Bottom boundary or bushes
for (let i = 0; i < W; i += 3) {
    drawObj(i, 23, 'TT');
}

const mapDef = `        mridula_bhawan: {
            width: ${W}, height: ${H},
            ground: [\n                ` + ground.map(g => `'${g}'`).join(',\n                ') + `\n            ],
            objects: [\n                ` + objects.map(o => `'${o}'`).join(',\n                ') + `\n            ],
            npcs: [
                { id: 'vedi_home', sprite: 'vedi', x: 23, y: 11, dir: 'down', dialogue: 'vedi_residential', name: 'Vedi' }
            ],
            doors: [
                { x: 5, y: 5, target: 'shogo_house_f1', spawnX: 4, spawnY: 7 },
                { x: 10, y: 24, target: 'mhow_highway', spawnX: 10, spawnY: 2, condition: (p) => Vehicles.riding },
                { x: 11, y: 24, target: 'mhow_highway', spawnX: 11, spawnY: 2, condition: (p) => Vehicles.riding },
                { x: 12, y: 24, target: 'mhow_highway', spawnX: 12, spawnY: 2, condition: (p) => Vehicles.riding }
            ],
            interactables: [],
            signs: [
                { x: 15, y: 17, text: 'Mhow Highway →\\n(Drive south to travel)' }
            ],
            playerStart: { x: 5, y: 6 }
        },`;

let mapsJs = fs.readFileSync('js/maps.js', 'utf8');
const start = mapsJs.indexOf('mridula_bhawan: {');
const end = mapsJs.indexOf('mhow_highway: {');

if (start !== -1 && end !== -1) {
    mapsJs = mapsJs.substring(0, start) + mapDef + '\n\n        ' + mapsJs.substring(end);
    fs.writeFileSync('js/maps.js', mapsJs);
    console.log("Patched Mridula Bhawan successfully.");
} else {
    console.error("Could not find insertion points. Start:", start, "End:", end);
}
