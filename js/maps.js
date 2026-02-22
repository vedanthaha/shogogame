// ===== MAP DATA =====
const Maps = {
    tileKey: {
        G: 'grass', D: 'grassDark', P: 'path', W: 'water', F: 'flower',
        T: 'tree', C: 'sakura', S: 'wall', K: 'wallWood', R: 'roofRed', B: 'roofBlue',
        d: 'door', i: 'sign', b: 'bench', f: 'fence', h: 'bush',
        t: 'table', k: 'bookshelf', c: 'computer', m: 'mic', M: 'mat',
        // New keys
        V: 'wallVedi', v: 'wallVediInt', Q: 'roofWarm',
        E: 'bed', e: 'bedHead', w: 'window', L: 'lamp', r: 'rug', s: 'shelf',
        A: 'wallBedroom', u: 'couch', X: 'mailbox', Z: 'flowerBed',
        o: 'floor',
        // Residential
        1: 'road', 2: 'roadLine', 3: 'sidewalk', 4: 'aptWallBlue', 5: 'aptWallGrey',
        6: 'aptDoor', 7: 'garage', 9: 'boundaryWall', 0: 'shopSign', '!': 'pylon', '@': 'carParked', 8: 'scootyParked',
        'H': 'stairs', 'N': 'kitchenCounter', 'j': 'sink', 'l': 'closet'
    },
    solidTiles: new Set(['T', 'C', 'S', 'K', 'R', 'B', 'Q', 'V', 'h', 'f', 't', 'k', 'c', 'm', 'b', 'E', 'e', 'L', 's', 'A', 'u', 'X', 'Z', 'v', 'i', '4', '5', '6', '9', '0', '!', '@', '8', 'N', 'j', 'l']),
    current: 'shogo_bedroom',

    data: {
        // ====== SHOGO'S BEDROOM (intro map) ======
        shogo_bedroom: {
            width: 8, height: 8,
            ground: [
                'oooooooo', 'oooooooo', 'oooooooo', 'oooooooo',
                'oooooooo', 'oooooooo', 'oooooooo', 'oooooooo',
            ],
            objects: [
                'AAAAAAAA',
                'AE....LA',
                'AE.....A',
                'A..r...A',
                'A.....lA',
                'A....kcA',
                'A...H..A',
                'AAAAAAAA',
            ],
            npcs: [],
            doors: [{ x: 4, y: 6, target: 'shogo_house_f1', spawnX: 7, spawnY: 2 }],
            signs: [],
            interactables: [
                { x: 1, y: 1, text: "Your cozy bed... you feel rested." },
                { x: 5, y: 5, text: "A desk with a PC. Maybe check messages?" },
            ],
            playerStart: { x: 2, y: 1 },
        },

        shogo_house_f1: {
            width: 10, height: 9,
            ground: [
                'oooooooooo', 'oooooooooo', 'oooooooooo', 'oooooooooo',
                'oooooooooo', 'oooooooooo', 'oooooooooo', 'oooooooooo',
                'oooooooooo',
            ],
            objects: [
                'AAAAAAAAAA',
                'ANNNj...HA',
                'A........A',
                'A..u...u.A',
                'A........A',
                'A........A',
                'A........A',
                'A...d....A',
                'AAAAAAAAAA',
            ],
            npcs: [],
            doors: [
                { x: 8, y: 1, target: 'shogo_bedroom', spawnX: 4, spawnY: 6 },
                { x: 4, y: 7, target: 'mridula_bhawan', spawnX: 5, spawnY: 6 }
            ],
            signs: [],
            interactables: [],
            playerStart: { x: 4, y: 7 },
        },

        // ====== OVERWORLD (expanded) ======
        overworld: {
            width: 45, height: 35,
            ground: [
                'DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD',
                'DGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGD',
                'DGFGGGGGGGGGGGGGGGGGGGGGGGGFGGGGGGGGGFGGGGGGFD',
                'DGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGD',
                'DGGGGGPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPGGGGGGD',
                'DGGGGGPGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGPGGGGGGGD',
                'DGGGGGPGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGPGGGGGGGD',
                'DGGGGGPGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGPGGGGGGGD',
                'DGGGGGPGGGGGGGGFGGGGGGGGGGGGGGGGGGGGGPGGGGGGGD',
                'DGGGGGPGGGGGGGGGGGGGGGGGGGGGGGGGGGGPPPPGGGGGFD',
                'DGGGGGPGGGGGGGGGGGGGGGGGGGGGGGGGGGPPGGPGGGGGFD',
                'DGGGGGPGGGGGGGGGGGGGGGGGGGGGGGGGGPPGGGPGGGGGFD',
                'DGGGGGPGGGGGGGGGGGGGGGGGGGGGGGGGPPGGGGPGGGGGFD',
                'DGFGPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPGGGGGPGGGGFD',
                'DGGGGPGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGPGGGGGFD',
                'DGGGGPGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGPGGGGGFD',
                'DGGGGPGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGPPGGGGGFD',
                'DGGGGPGGGGGGGGGGWWWWWGGGGGGGGGGGGGGGGPGGGGGGFD',
                'DGGGGPGGGGGGGGGWWWWWWGGGGGGGGGGGGGGGPPGGGGGGGD',
                'DGGGGPGGGGGGGGGGWWWWWGGGGGGGGGGGGGGPPGGGGGGGGD',
                'DGGGGPGGGGGGGFGGGWWWGGGFGGGGGGGGGPPPPGGGGGGGGD',
                'DGGGPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPGGGPGGGGGGFD',
                'DGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGPPGGGGGGFD',
                'DGFGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGPPPGGGGGGFD',
                'DGGGGGGGPPPPPPPPPPPPPPPPPPPPGGGGGGGGGGGGGGGGGD',
                'DGGGGGGPPGGGGGGGGGGGGGGGGGGPPGGGGGGGGGGGGGGGGD',
                'DGGGGGGPGGGGGGGGGGGGGGGGGGGPGGGGGGGGGGGFGGGGGD',
                'DGGGGGPPGGGGGGGGGGGGGGGGGGPPGGGGGGGGFGGGGGGGGD',
                'DGGGGPPGGGGGFGGGGGGGFGGGGGPGGGGGGGGGGGGGGGGGFD',
                'DGGGPPGGGGGGGGGGGGGGGGGGGGPPGGGGGFGGGGGGGGGGFD',
                'DGGPPGGFGGGGGGGGGGGFGGGGGGGPGGGGGGGGGFGGGGGGGD',
                'DGPPGGGGGGGFGGGGGGGGGGGGGGGPPGGGGGGGGGGGGGGGFD',
                'DGGGGGGFGGGGGGGGGGGGFGGGFGGGPGGGFGGGGGFGGGGGFD',
                'DGGGGGGGGGFGGGGGGGGGGGGGGGGGPGGGGGFGGGGGGGGGFD',
                'DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD',
            ],
            objects: null,
            npcs: [
                { id: 'luna', sprite: 'luna', x: 12, y: 8, dir: 'down', dialogue: 'luna_greet', name: 'Luna' },
                { id: 'kai', sprite: 'kai', x: 28, y: 11, dir: 'down', dialogue: 'kai_greet', name: 'Kai' },
                { id: 'mira', sprite: 'mira', x: 18, y: 19, dir: 'left', dialogue: 'mira_greet', name: 'Mira' },
                { id: 'rex', sprite: 'rex', x: 33, y: 6, dir: 'down', dialogue: 'rex_greet', name: 'Rex' },
                { id: 'vedi', sprite: 'vedi', x: 12, y: 26, dir: 'down', dialogue: 'vedi_greet', name: 'Vedi' },
            ],
            doors: [
                { x: 9, y: 5, target: 'comfort_house', spawnX: 5, spawnY: 7 },
                { x: 28, y: 4, target: 'creator_studio', spawnX: 5, spawnY: 7 },
                { x: 38, y: 9, target: 'voice_booth', spawnX: 5, spawnY: 7 },
                { x: 38, y: 18, target: 'team_arena', spawnX: 5, spawnY: 7 },
                { x: 7, y: 24, target: 'shogo_bedroom', spawnX: 5, spawnY: 6 },
                { x: 14, y: 24, target: 'vedi_house', spawnX: 5, spawnY: 7 },
            ],
            signs: [
                { x: 8, y: 6, text: 'Welcome to Comfort Town!\nA safe space for everyone.' },
                { x: 26, y: 5, text: 'Creator Studio\nUnlock your creative spark!' },
                { x: 36, y: 10, text: 'Voice Booth\nLet your voice be heard!' },
                { x: 36, y: 19, text: 'Team Arena\nLeadership through empathy.' },
                { x: 5, y: 25, text: "Shogo's House\nHome sweet home." },
                { x: 16, y: 25, text: "Vedi's House\nBest friend's place." },
            ],
            animals: [
                { id: 'puppy1', type: 'puppy', x: 10, y: 15, homeX: 10, homeY: 15 },
                { id: 'puppy2', type: 'puppy', x: 25, y: 8, homeX: 25, homeY: 8 },
                { id: 'cat1', type: 'cat', x: 20, y: 22, homeX: 20, homeY: 22 },
                { id: 'cat2', type: 'cat', x: 8, y: 11, homeX: 8, homeY: 11 },
                { id: 'bird1', type: 'bird', x: 15, y: 6, homeX: 15, homeY: 6 },
                { id: 'bird2', type: 'bird', x: 30, y: 14, homeX: 30, homeY: 14 },
            ],
            playerStart: { x: 7, y: 25 },
        },

        // ====== VEDI'S HOUSE ======
        vedi_house: {
            width: 12, height: 10,
            ground: [
                'oooooooooooo', 'oooooooooooo', 'oooooooooooo', 'oooooooooooo',
                'oooooooooooo', 'oooooooooooo', 'oooooooooooo', 'oooooooooooo',
                'oooooooooooo', 'oooooooooooo',
            ],
            objects: null,
            npcs: [
                { id: 'vedi_home', sprite: 'vedi', x: 6, y: 4, dir: 'down', dialogue: 'vedi_home', name: 'Vedi' },
            ],
            doors: [{ x: 5, y: 9, target: 'overworld', spawnX: 14, spawnY: 25 }],
            signs: [],
            interactables: [
                { x: 3, y: 2, text: "Vedi's couch. Looks super comfy." },
                { x: 8, y: 1, text: "A shelf full of books and games." },
            ],
            playerStart: { x: 5, y: 7 },
        },

        comfort_house: {
            width: 12, height: 10,
            ground: [
                'oooooooooooo', 'oooooooooooo', 'oooooooooooo', 'oooooooooooo',
                'oooooooooooo', 'oooooooooooo', 'oooooooooooo', 'oooooooooooo',
                'oooooooooooo', 'oooooooooooo',
            ],
            objects: null,
            npcs: [
                { id: 'npc1', sprite: 'npc_generic', x: 3, y: 3, dir: 'down', dialogue: 'comfort_npc', name: 'Resident' },
            ],
            doors: [{ x: 5, y: 9, target: 'overworld', spawnX: 9, spawnY: 6 }],
            signs: [],
            playerStart: { x: 5, y: 7 },
        },

        creator_studio: {
            width: 12, height: 10,
            ground: [
                'oooooooooooo', 'oooooooooooo', 'oooooooooooo', 'oooooooooooo',
                'oooooooooooo', 'oooooooooooo', 'oooooooooooo', 'oooooooooooo',
                'oooooooooooo', 'oooooooooooo',
            ],
            objects: null,
            npcs: [
                { id: 'studio_npc', sprite: 'npc_generic', x: 6, y: 4, dir: 'down', dialogue: 'studio_npc', name: 'Mentor' },
            ],
            doors: [{ x: 5, y: 9, target: 'overworld', spawnX: 28, spawnY: 5 }],
            signs: [],
            playerStart: { x: 5, y: 7 },
        },

        voice_booth: {
            width: 12, height: 10,
            ground: [
                'oooooooooooo', 'oooooooooooo', 'oooooooooooo', 'oooooooooooo',
                'oooooooooooo', 'oooooooooooo', 'oooooooooooo', 'oooooooooooo',
                'oooooooooooo', 'oooooooooooo',
            ],
            objects: null,
            npcs: [
                { id: 'booth_npc', sprite: 'npc_generic', x: 6, y: 3, dir: 'down', dialogue: 'booth_npc', name: 'Sound Tech' },
            ],
            doors: [{ x: 5, y: 9, target: 'overworld', spawnX: 38, spawnY: 10 }],
            signs: [],
            playerStart: { x: 5, y: 7 },
        },

        team_arena: {
            width: 12, height: 10,
            ground: [
                'oooooooooooo', 'oooooooooooo', 'oooooooooooo', 'oooooooooooo',
                'oooooooooooo', 'oooooooooooo', 'oooooooooooo', 'oooooooooooo',
                'oooooooooooo', 'oooooooooooo',
            ],
            objects: null,
            npcs: [
                { id: 'arena_npc1', sprite: 'luna', x: 4, y: 3, dir: 'down', dialogue: 'arena_npc1', name: 'Alex' },
                { id: 'arena_npc2', sprite: 'kai', x: 6, y: 4, dir: 'left', dialogue: 'arena_npc2', name: 'Sam' },
                { id: 'arena_npc3', sprite: 'mira', x: 8, y: 3, dir: 'down', dialogue: 'arena_npc3', name: 'Jo' },
            ],
            doors: [{ x: 5, y: 9, target: 'overworld', spawnX: 38, spawnY: 19 }],
            signs: [],
            playerStart: { x: 5, y: 7 },
        },

        mridula_bhawan: {
            width: 30, height: 25,
            ground: [
                'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGG', 'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGG', 'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGG', 'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
                'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGG', 'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGG', '333333333333333333333333333333', '333333333333333333333333333333',
                '333333333333333333333333333333', '333333333333333333333333333333', '777777777777777777777777777777', '777777777777777777777777777777',
                '111111111111111111111111111111', '111111111111111111111111111111', '222222222222222222222222222222', '111111111111111111111111111111',
                '111111111111111111111111111111', '333333333333333333333333333333', '333333333333333333333333333333', '333333333333333333333333333333',
                'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGG', 'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGG', 'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGG', 'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
                'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
            ],
            objects: [
                '999999999999999999999999999999', '9............................9', '9.TTTTT....TTTTT....TTTTT....9', '9............................9',
                '9..44444....55555....VVVVV...9', '9..44d44....55d55....VQVdV...9', '3..33333....33333....33333...3', '3............................3',
                '3............................3', '3............................3', '7...8..........@..........8..7', '7............................7',
                '111111111111111111111111111111', '111111111111111111111111111111', '222222222222222222222222222222', '111111111111111111111111111111',
                '111111111111111111111111111111', '33!3333333000000033333333!3333', '3.........0....0.............3', '3.........0....0.............3',
                'G..TTTTT..000000..TTTTT...TTTG', 'G............................G', 'G............................G', 'G............................G',
                'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
            ],
            npcs: [
                { id: 'vedi_home', sprite: 'vedi', x: 23, y: 11, dir: 'down', dialogue: 'vedi_residential', name: 'Vedi' },
            ],
            doors: [
                { x: 5, y: 5, target: 'shogo_house_f1', spawnX: 4, spawnY: 7 },
                // South transition to highway
                { x: 10, y: 24, target: 'mhow_highway', spawnX: 10, spawnY: 2, condition: (p) => Vehicles.riding },
                { x: 11, y: 24, target: 'mhow_highway', spawnX: 11, spawnY: 2, condition: (p) => Vehicles.riding },
                { x: 12, y: 24, target: 'mhow_highway', spawnX: 12, spawnY: 2, condition: (p) => Vehicles.riding },
            ],
            signs: [
                { x: 15, y: 17, text: 'Mhow Highway →\n(Drive south to travel)' },
            ],
            playerStart: { x: 12, y: 11 },
        },

        mhow_highway: {
            width: 60, height: 15,
            ground: [
                'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
                '333333333333333333333333333333333333333333333333333333333333',
                '111111111111111111111111111111111111111111111111111111111111',
                '111111111111111111111111111111111111111111111111111111111111',
                '222222222222222222222222222222222222222222222222222222222222',
                '111111111111111111111111111111111111111111111111111111111111',
                '111111111111111111111111111111111111111111111111111111111111',
                '333333333333333333333333333333333333333333333333333333333333',
                'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
                'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
                'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
                'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
                'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
                'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
                'GGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG',
            ],
            objects: [
                'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
                '............................................................',
                '............................................................',
                '............................................................',
                '............................................................',
                '............................................................',
                '............................................................',
                '............................................................',
                '..TTTT..TTTT..TTTT..TTTT..TTTT..TTTT..TTTT..TTTT..TTTT..TTTT',
                '............................................................',
                '............................................................',
                '............................................................',
                '............................................................',
                '............................................................',
                'TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT',
            ],
            npcs: [],
            doors: [
                { x: 10, y: 0, target: 'mridula_bhawan', spawnX: 10, spawnY: 22 },
                { x: 11, y: 0, target: 'mridula_bhawan', spawnX: 11, spawnY: 22 },
            ],
            signs: [
                { x: 50, y: 8, text: 'Mhow →\n(Coming soon)' },
            ],
            playerStart: { x: 5, y: 5 },
        },
    },

    // Build object layers
    buildObjects() {
        // Shogo's Bedroom and House F1 objects are now in strings

        // === OVERWORLD ===
        const ow = this.data.overworld;
        const obj = Array.from({ length: ow.height }, () => Array(ow.width).fill('.'));

        // Border trees
        for (let x = 0; x < ow.width; x++) { obj[0][x] = 'T'; obj[ow.height - 1][x] = 'T'; }
        for (let y = 0; y < ow.height; y++) { obj[y][0] = 'T'; obj[y][ow.width - 1] = 'T'; }
        // Tree clusters
        [[2, 1], [3, 1], [2, 2], [3, 2], [41, 1], [42, 1], [41, 2], [42, 2],
        [2, 31], [3, 31], [2, 32], [3, 32], [41, 31], [42, 31], [41, 32], [42, 32],
        [20, 7], [21, 7], [20, 8], [21, 8],
        ].forEach(([x, y]) => { if (y < ow.height && x < ow.width) obj[y][x] = 'T'; });

        // Building 1: Comfort House
        obj[3][8] = 'R'; obj[3][9] = 'R'; obj[3][10] = 'R';
        obj[4][8] = 'S'; obj[4][9] = 'S'; obj[4][10] = 'S';
        obj[5][8] = 'S'; obj[5][9] = 'd'; obj[5][10] = 'S';

        // Building 2: Creator Studio
        obj[2][27] = 'B'; obj[2][28] = 'B'; obj[2][29] = 'B';
        obj[3][27] = 'S'; obj[3][28] = 'S'; obj[3][29] = 'S';
        obj[4][27] = 'S'; obj[4][28] = 'd'; obj[4][29] = 'S';

        // Building 3: Voice Booth
        obj[7][37] = 'R'; obj[7][38] = 'R'; obj[7][39] = 'R';
        obj[8][37] = 'S'; obj[8][38] = 'S'; obj[8][39] = 'S';
        obj[9][37] = 'S'; obj[9][38] = 'd'; obj[9][39] = 'S';

        // Building 4: Team Arena
        obj[16][37] = 'B'; obj[16][38] = 'B'; obj[16][39] = 'B';
        obj[17][37] = 'S'; obj[17][38] = 'S'; obj[17][39] = 'S';
        obj[18][37] = 'S'; obj[18][38] = 'd'; obj[18][39] = 'S';

        // Shogo's House (bottom-left area)
        obj[22][6] = 'R'; obj[22][7] = 'R'; obj[22][8] = 'R';
        obj[23][6] = 'S'; obj[23][7] = 'S'; obj[23][8] = 'S';
        obj[24][6] = 'S'; obj[24][7] = 'd'; obj[24][8] = 'S';

        // Vedi's House (next to Shogo's - warm colored)
        obj[22][13] = 'Q'; obj[22][14] = 'Q'; obj[22][15] = 'Q';
        obj[23][13] = 'V'; obj[23][14] = 'V'; obj[23][15] = 'V';
        obj[24][13] = 'V'; obj[24][14] = 'd'; obj[24][15] = 'V';

        // Mailboxes
        obj[25][5] = 'X'; obj[25][16] = 'X';

        // Flower beds near houses
        obj[25][8] = 'Z'; obj[25][9] = 'Z';
        obj[25][13] = 'Z';

        // Signs
        ow.signs.forEach(s => { obj[s.y][s.x] = 'i'; });

        // Benches
        [[14, 15], [30, 15], [14, 22], [30, 22], [10, 28], [22, 28]].forEach(([x, y]) => { obj[y][x] = 'b'; });

        // Fences near pond
        [[16, 16], [17, 16], [22, 16], [23, 16], [16, 20], [17, 20], [22, 20], [23, 20]].forEach(([x, y]) => { obj[y][x] = 'f'; });

        // Sakura trees
        [[5, 7], [16, 6], [22, 8], [35, 5], [10, 20], [27, 19], [33, 20], [17, 27], [10, 27], [25, 28], [35, 27],
        [40, 5], [40, 14], [40, 22], [40, 30], [5, 15], [5, 20], [30, 28]
        ].forEach(([x, y]) => { if (y < ow.height && x < ow.width && obj[y][x] === '.') obj[y][x] = 'C'; });

        // Bushes
        [[6, 9], [15, 7], [22, 6], [30, 8], [13, 14], [24, 14], [7, 22], [23, 23], [33, 14], [18, 9],
        [6, 30], [15, 30], [25, 30], [35, 30], [8, 17], [30, 17]
        ].forEach(([x, y]) => { if (y < ow.height && x < ow.width && obj[y][x] === '.') obj[y][x] = 'h'; });

        ow.objects = obj.map(r => r.join(''));

        // === VEDI'S HOUSE ===
        this.buildInterior('vedi_house', [
            { x: 3, y: 2, t: 'u' }, { x: 4, y: 2, t: 'u' }, // couch
            { x: 8, y: 1, t: 'k' }, { x: 9, y: 1, t: 'k' }, // bookshelves
            { x: 3, y: 5, t: 't' }, // table
            { x: 7, y: 5, t: 'c' }, // computer
        ]);

        // === EXISTING INTERIORS ===
        this.buildInterior('comfort_house', [
            { x: 1, y: 1, t: 'k' }, { x: 2, y: 1, t: 'k' }, { x: 9, y: 1, t: 'k' }, { x: 10, y: 1, t: 'k' },
            { x: 5, y: 3, t: 't' }, { x: 6, y: 3, t: 't' },
        ]);
        this.buildInterior('creator_studio', [
            { x: 2, y: 2, t: 'c' }, { x: 3, y: 2, t: 'c' }, { x: 8, y: 2, t: 'c' }, { x: 9, y: 2, t: 'c' },
            { x: 2, y: 5, t: 'k' }, { x: 9, y: 5, t: 'k' },
        ]);
        this.buildInterior('voice_booth', [
            { x: 5, y: 2, t: 'm' }, { x: 6, y: 2, t: 'm' },
            { x: 2, y: 1, t: 'k' }, { x: 9, y: 1, t: 'k' },
        ]);
        this.buildInterior('team_arena', [
            { x: 5, y: 5, t: 'M' }, { x: 6, y: 5, t: 'M' }, { x: 5, y: 6, t: 'M' }, { x: 6, y: 6, t: 'M' },
            { x: 1, y: 1, t: 'k' }, { x: 10, y: 1, t: 'k' },
        ]);
    },

    buildInterior(mapId, items) {
        const m = this.data[mapId];
        const obj = Array.from({ length: m.height }, () => Array(m.width).fill('.'));
        for (let x = 0; x < m.width; x++) obj[0][x] = 'K';
        for (let y = 0; y < m.height; y++) { obj[y][0] = 'K'; obj[y][m.width - 1] = 'K'; }
        m.doors.forEach(d => { obj[d.y][d.x] = 'd'; });
        items.forEach(it => { obj[it.y][it.x] = it.t; });
        m.objects = obj.map(r => r.join(''));
    },

    // Queries
    getGround(mapId, x, y) {
        const m = this.data[mapId];
        if (!m || y < 0 || y >= m.height || x < 0 || x >= m.width) return 'D';
        return m.ground[y][x];
    },
    getObject(mapId, x, y) {
        const m = this.data[mapId];
        if (!m || !m.objects || y < 0 || y >= m.height || x < 0 || x >= m.width) return '.';
        return m.objects[y][x];
    },
    isSolid(mapId, x, y) {
        const m = this.data[mapId];
        if (!m || y < 0 || y >= m.height || x < 0 || x >= m.width) return true;
        const obj = this.getObject(mapId, x, y);
        if (obj !== '.' && obj !== 'd' && this.solidTiles.has(obj)) return true;
        // Water is no longer solid — player can swim!
        return false;
    },
    getDoor(mapId, x, y) {
        const m = this.data[mapId]; if (!m) return null;
        return m.doors.find(d => d.x === x && d.y === y) || null;
    },
    getSign(mapId, x, y) {
        const m = this.data[mapId]; if (!m) return null;
        return (m.signs || []).find(s => s.x === x && s.y === y) || null;
    },
    getNPC(mapId, x, y) {
        const m = this.data[mapId]; if (!m) return null;
        return (m.npcs || []).find(n => n.x === x && n.y === y) || null;
    },
    getInteractable(mapId, x, y) {
        const m = this.data[mapId]; if (!m) return null;
        return (m.interactables || []).find(i => i.x === x && i.y === y) || null;
    },
    getAnimal(mapId, x, y) {
        const m = this.data[mapId]; if (!m) return null;
        return (m.animals || []).find(a => a.x === x && a.y === y) || null;
    }
};
