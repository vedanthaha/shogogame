const fs = require('fs');

const W = 160;
const H = 160;

function createLayer(fillChar) {
    return Array.from({ length: H }, () => Array(W).fill(fillChar));
}

const ground = createLayer('G');
const objects = createLayer('.');

// 1. BOUNDARY WALL
// The compound is large. Let's make the compound from x=20 to x=140 (width 120), y=20 to y=150 (height 130).
const cx1 = 20, cx2 = 140;
const cy1 = 20, cy2 = 150;

// Draw boundary wall (9)
for (let x = cx1; x <= cx2; x++) {
    objects[cy1][x] = '9';
    objects[cy2][x] = '9';
}
for (let y = cy1; y <= cy2; y++) {
    objects[y][cx1] = '9';
    objects[y][cx2] = '9';
}

// 2. MAIN GATE
// South gate at x=80, width 10
const gw1 = 75, gw2 = 85;
for (let x = gw1; x <= gw2; x++) {
    objects[cy2][x] = '.'; // open gate
    // Road leading out
    for (let y = cy2; y < H; y++) {
        ground[y][x] = '1'; // road
    }
}

// 3. INTERNAL PATHS
// Main road coming from gate to center
for (let y = cy2 - 1; y > 100; y--) {
    for (let x = gw1; x <= gw2; x++) {
        ground[y][x] = '1';
    }
}

// Roundabout or branching paths
for (let x = 50; x <= 110; x++) {
    for (let y = 90; y <= 100; y++) {
        ground[y][x] = '1';
    }
}

// 4. MAIN APARTMENT BUILDING
// Large footprint for Mridula Bhawan
// Let's place it at x=50 to 110, y=40 to 80
const bx1 = 50, bx2 = 110;
const by1 = 40, by2 = 80;

for (let y = by1; y <= by2; y++) {
    for (let x = bx1; x <= bx2; x++) {
        ground[y][x] = '3'; // Sidewalk/concrete base
    }
}

// Draw the building walls (5 for aptWallGrey, 4 for aptWallBlue)
for (let x = bx1 + 2; x <= bx2 - 2; x++) {
    objects[by1 + 2][x] = '5';
    objects[by2 - 2][x] = '5';
}
for (let y = by1 + 2; y <= by2 - 2; y++) {
    objects[y][bx1 + 2] = '5';
    objects[y][bx2 - 2] = '5';
}
// Fill building roof/solid core
for (let y = by1 + 3; y <= by2 - 3; y++) {
    for (let x = bx1 + 3; x <= bx2 - 3; x++) {
        objects[y][x] = 'S'; // generic wall/solid
    }
}

// Entrances to building
// Main entrance at x=80, y=80-2
objects[by2 - 2][79] = '6'; // Apt door
objects[by2 - 2][80] = '6'; // Apt door
objects[by2 - 2][81] = '6'; // Apt door
ground[by2 - 1][80] = 'P';
ground[by2][80] = 'P';

// 5. PARKING AREA
// Large parking block to the left (x=25 to 45, y=90 to 140)
const px1 = 25, px2 = 45;
const py1 = 90, py2 = 140;
for (let y = py1; y <= py2; y++) {
    for (let x = px1; x <= px2; x++) {
        ground[y][x] = '7'; // garage/parking concrete
    }
}

// Draw parking lines (2) inside
for (let y = py1 + 2; y <= py2 - 2; y += 4) {
    for (let x = px1 + 2; x <= px2 - 2; x++) {
        ground[y][x] = '2';
    }
}

// Park some vehicles
objects[100][30] = '@'; // Car
objects[105][30] = '@'; // Car
objects[110][35] = '8'; // Scooty
objects[120][35] = '8'; // Scooty

// 6. NATURAL GREENERY & TREES
// Helper to place random clusters
function placeTrees(tx1, tx2, ty1, ty2, density) {
    for (let y = ty1; y <= ty2; y++) {
        for (let x = tx1; x <= tx2; x++) {
            if (ground[y][x] === 'G' && objects[y][x] === '.' && Math.random() < density) {
                objects[y][x] = 'T'; // Tree
            }
        }
    }
}

// Left garden
placeTrees(cx1 + 2, 45, cy1 + 2, 85, 0.15);
// Right garden
placeTrees(115, cx2 - 2, cy1 + 2, 145, 0.15);
// Top garden behind building
placeTrees(cx1 + 2, cx2 - 2, cy1 + 2, 35, 0.2);

// Add some dirt/dark grass patches organically
for (let y = cy1; y <= cy2; y++) {
    for (let x = cx1; x <= cx2; x++) {
        if (ground[y][x] === 'G' && Math.random() < 0.05) {
            ground[y][x] = 'D';
            // expand patch
            if (Math.random() < 0.5 && x < W - 1) ground[y][x + 1] = 'D';
            if (Math.random() < 0.5 && y < H - 1) ground[y + 1][x] = 'D';
        }
    }
}

// 7. NEIGHBOR BUILDINGS (Outside compound)
// South of compound, road continues
// Left and right of compound, other boundary walls and roofs
for (let y = 5; y < H; y++) {
    for (let x = 0; x < 15; x++) {
        if (y % 20 < 15) objects[y][x] = 'S'; // chunks of neighbor buildings
    }
    for (let x = 145; x < W; x++) {
        if (y % 25 < 18) objects[y][x] = 'S';
    }
}

// Top neighbor buildings
for (let y = 0; y < 15; y++) {
    for (let x = 0; x < W; x++) {
        if (x % 30 < 20) objects[y][x] = 'S';
    }
}

function formatArray(arr) {
    return arr.map(row => `'${row.join('')}'`).join(',\n                ');
}

const mapDef = `
        mridula_bhawan: {
            width: ${W}, height: ${H},
            ground: [
                ${formatArray(ground)}
            ],
            objects: [
                ${formatArray(objects)}
            ],
            npcs: [
                { id: 'vedi_home', sprite: 'vedi', x: 85, y: 75, dir: 'down', dialogue: 'vedi_residential', name: 'Vedi' },
            ],
            doors: [
                { x: 80, y: ${by2 - 2}, target: 'shogo_house_f1', spawnX: 4, spawnY: 7 },
                // South transition to highway is at the main gate
                ${[...Array(gw2 - gw1 + 1).keys()].map(i => `{ x: ${gw1 + i}, y: ${H - 1}, target: 'mhow_highway', spawnX: ${10 + i}, spawnY: 2, condition: (p) => Vehicles.riding }`).join(',\n                ')}
            ],
            signs: [
                { x: 82, y: ${by2 - 1}, text: 'Mridula Bhawan\\nBlock A' },
            ],
            playerStart: { x: 80, y: ${by2} },
        },
`;

fs.writeFileSync('generated_map.txt', mapDef);
console.log('Map generated.');
