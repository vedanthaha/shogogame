// ===== POLISHED PIXEL ART SPRITES =====
const TILE = 16;
const CHAR_W = 16, CHAR_H = 16;
const Sprites = {
    tiles: {}, chars: {}, animals: {},

    init() { this.makeTiles(); this.makeCharacters(); this.makeAnimals(); this.makeShogo(); this.makeVehicles(); },

    make(w, h, fn) {
        const c = document.createElement('canvas');
        c.width = w; c.height = h;
        const x = c.getContext('2d'); x.imageSmoothingEnabled = false;
        fn(x); return c;
    },

    makeTiles() {
        const T = this.tiles, S = TILE;

        // Warm grass base
        T.grass = this.make(S, S, c => {
            c.fillStyle = '#6b9c4e'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#7aac58';[[2, 3], [10, 1], [5, 9], [13, 12]].forEach(([x, y]) => c.fillRect(x, y, 1, 1));
            c.fillStyle = '#5e8c42';[[8, 5], [1, 12], [14, 7]].forEach(([x, y]) => c.fillRect(x, y, 1, 1));
        });
        T.grass2 = this.make(S, S, c => {
            c.fillStyle = '#6fa050'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#7fb45a';[[4, 6], [12, 2], [1, 10], [9, 14]].forEach(([x, y]) => c.fillRect(x, y, 1, 1));
            c.fillStyle = '#608e44';[[7, 3], [3, 13], [11, 9]].forEach(([x, y]) => c.fillRect(x, y, 1, 1));
        });
        T.grass3 = this.make(S, S, c => {
            c.fillStyle = '#68984a'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#80b860';[[3, 4], [10, 8]].forEach(([x, y]) => { c.fillRect(x, y, 1, 2); });
            c.fillStyle = '#5a8a3e';[[7, 2], [13, 11]].forEach(([x, y]) => c.fillRect(x, y, 1, 1));
        });
        T.grassDark = this.make(S, S, c => {
            c.fillStyle = '#5a8a3e'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#4d7a32';[[3, 4], [9, 2], [6, 10], [12, 13]].forEach(([x, y]) => c.fillRect(x, y, 1, 1));
        });
        T.path = this.make(S, S, c => {
            c.fillStyle = '#d4c09a'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#c4b08a';[[4, 2], [11, 8], [2, 13], [14, 5]].forEach(([x, y]) => c.fillRect(x, y, 1, 1));
            c.fillStyle = '#e0d0a8';[[6, 4], [1, 9], [13, 1]].forEach(([x, y]) => c.fillRect(x, y, 1, 1));
        });
        T.flower = this.make(S, S, c => {
            c.drawImage(T.grass, 0, 0);
            [[4, 5, '#FFB0C0'], [10, 3, '#FFD080'], [7, 11, '#FF90A8'], [12, 9, '#C0E8B8'], [2, 9, '#E0B0FF']].forEach(([x, y, col]) => {
                c.fillStyle = col; c.fillRect(x, y, 2, 2);
                c.fillStyle = '#FFE8A0'; c.fillRect(x, y, 1, 1);
            });
        });
        T.water = this.make(S, S, c => {
            c.fillStyle = '#6ab4d8'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#80c8e8';[[2, 3], [8, 7], [12, 2], [5, 12]].forEach(([x, y]) => c.fillRect(x, y, 3, 1));
            c.fillStyle = '#90d4f0';[[4, 1], [10, 9], [1, 6]].forEach(([x, y]) => c.fillRect(x, y, 1, 1));
        });
        T.water2 = this.make(S, S, c => {
            c.fillStyle = '#6ab4d8'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#80c8e8';[[5, 5], [10, 3], [1, 10], [14, 8]].forEach(([x, y]) => c.fillRect(x, y, 3, 1));
            c.fillStyle = '#90d4f0';[[7, 2], [3, 12], [12, 6]].forEach(([x, y]) => c.fillRect(x, y, 1, 1));
        });
        T.tree = this.make(S, S, c => {
            c.fillStyle = '#6b9c4e'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#8d6a42'; c.fillRect(5, 0, 6, S);
            c.fillStyle = '#7a5a36'; c.fillRect(7, 0, 2, S);
            c.fillStyle = '#3a7830'; c.fillRect(1, 0, 14, 8);
            c.fillStyle = '#4a8838'; c.fillRect(2, 1, 12, 5);
            c.fillStyle = '#58a048'; c.fillRect(4, 2, 3, 3);
        });
        T.treeCrown = this.make(S, S, c => {
            c.fillStyle = '#3a7830'; c.fillRect(0, 2, S, 14); c.fillRect(1, 0, 14, S);
            c.fillStyle = '#4a8838'; c.fillRect(2, 1, 12, 13);
            c.fillStyle = '#58a048'; c.fillRect(3, 3, 4, 4); c.fillRect(9, 5, 4, 3);
            c.fillStyle = '#3a7830'; c.fillRect(6, 2, 4, 4);
        });
        T.sakura = this.make(S, S, c => {
            c.fillStyle = '#6b9c4e'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#8d6a42'; c.fillRect(5, 0, 6, S);
            c.fillStyle = '#7a5a36'; c.fillRect(7, 0, 2, S);
            c.fillStyle = '#e8a0b0'; c.fillRect(1, 0, 14, 8);
            c.fillStyle = '#f0b0c0'; c.fillRect(2, 1, 12, 5);
            c.fillStyle = '#f8c0d0'; c.fillRect(4, 2, 3, 3);
        });
        T.sakuraCrown = this.make(S, S, c => {
            c.fillStyle = '#e8a0b0'; c.fillRect(0, 2, S, 14); c.fillRect(1, 0, 14, S);
            c.fillStyle = '#f0b0c0'; c.fillRect(2, 1, 12, 13);
            c.fillStyle = '#f8c8d8'; c.fillRect(3, 3, 4, 4); c.fillRect(9, 5, 4, 3);
            c.fillStyle = '#ffe0e8'; c.fillRect(5, 4, 2, 2);
        });
        T.bush = this.make(S, S, c => {
            c.fillStyle = '#6b9c4e'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#4a8838'; c.fillRect(2, 4, 12, 10); c.fillRect(1, 6, 14, 6);
            c.fillStyle = '#58a048'; c.fillRect(3, 5, 10, 8);
            c.fillStyle = '#68b858'; c.fillRect(5, 6, 3, 3); c.fillRect(9, 7, 2, 2);
            c.fillStyle = '#f0b0c0'; c.fillRect(6, 5, 1, 1); c.fillRect(10, 8, 1, 1);
        });
        T.wall = this.make(S, S, c => {
            c.fillStyle = '#96887a'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#a89a8c';
            for (let y = 0; y < S; y += 4) { const o = (y % 8 === 0) ? 0 : 4; for (let x = o; x < S; x += 8)c.fillRect(x, y, 7, 3); }
            c.fillStyle = '#827468'; for (let y = 3; y < S; y += 4)c.fillRect(0, y, S, 1);
        });
        T.wallWood = this.make(S, S, c => {
            c.fillStyle = '#b0906a'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#9a7a58'; for (let x = 0; x < S; x += 4)c.fillRect(x, 0, 1, S);
            c.fillStyle = '#c4a07a';[[2, 3], [6, 8], [10, 1], [14, 12]].forEach(([x, y]) => c.fillRect(x, y, 1, 1));
        });
        T.roofRed = this.make(S, S, c => {
            c.fillStyle = '#c86060'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#b05050'; for (let y = 0; y < S; y += 3)c.fillRect(0, y, S, 1);
            c.fillStyle = '#d87070'; c.fillRect(0, 0, S, 2);
        });
        T.roofBlue = this.make(S, S, c => {
            c.fillStyle = '#6088b8'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#5078a8'; for (let y = 0; y < S; y += 3)c.fillRect(0, y, S, 1);
            c.fillStyle = '#7098c8'; c.fillRect(0, 0, S, 2);
        });
        // Warm roof (for Vedi's house)
        T.roofWarm = this.make(S, S, c => {
            c.fillStyle = '#d89050'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#c87840'; for (let y = 0; y < S; y += 3)c.fillRect(0, y, S, 1);
            c.fillStyle = '#e8a060'; c.fillRect(0, 0, S, 2);
        });
        T.door = this.make(S, S, c => {
            c.fillStyle = '#96887a'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#6a4830'; c.fillRect(3, 2, 10, 14);
            c.fillStyle = '#8a6848'; c.fillRect(4, 3, 8, 12);
            c.fillStyle = '#FFD070'; c.fillRect(10, 8, 2, 2);
        });
        T.sign = this.make(S, S, c => {
            c.drawImage(T.grass, 0, 0);
            c.fillStyle = '#8d6a42'; c.fillRect(7, 8, 2, 8);
            c.fillStyle = '#b0906a'; c.fillRect(3, 3, 10, 6);
            c.fillStyle = '#9a7a58'; c.fillRect(4, 4, 8, 4);
            c.fillStyle = '#6a4830'; c.fillRect(5, 5, 2, 1); c.fillRect(8, 5, 3, 1);
        });
        T.fence = this.make(S, S, c => {
            c.drawImage(T.grass, 0, 0);
            c.fillStyle = '#b0906a'; c.fillRect(0, 5, S, 2); c.fillRect(0, 10, S, 2);
            c.fillStyle = '#9a7a58'; c.fillRect(2, 3, 2, 12); c.fillRect(12, 3, 2, 12);
        });
        T.bench = this.make(S, S, c => {
            c.drawImage(T.grass, 0, 0);
            c.fillStyle = '#8d6a42'; c.fillRect(2, 8, 12, 3);
            c.fillStyle = '#6a4830'; c.fillRect(3, 11, 2, 4); c.fillRect(11, 11, 2, 4);
            c.fillStyle = '#b0906a'; c.fillRect(2, 6, 12, 2);
        });
        T.floor = this.make(S, S, c => {
            c.fillStyle = '#c8a888'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#b89878';
            for (let y = 0; y < S; y += 8)for (let x = (y % 16 === 0 ? 0 : 8); x < S; x += 16)c.fillRect(x, y, 8, 8);
        });
        T.table = this.make(S, S, c => {
            c.drawImage(T.floor, 0, 0);
            c.fillStyle = '#8d6a42'; c.fillRect(2, 4, 12, 8);
            c.fillStyle = '#b0906a'; c.fillRect(3, 5, 10, 6);
        });
        T.bookshelf = this.make(S, S, c => {
            c.fillStyle = '#6a4830'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#8d6a42';
            [1, 5, 9, 13].forEach(sy => { c.fillRect(1, sy, 14, 3); });
            const bk = ['#c86060', '#6088b8', '#58a048', '#d4c09a', '#a890c0'];
            [1, 5, 9, 13].forEach(sy => { for (let bx = 1; bx < 14; bx += 3) { c.fillStyle = bk[(bx + sy) % bk.length]; c.fillRect(bx, sy, 2, 3); } });
        });
        T.mic = this.make(S, S, c => {
            c.drawImage(T.floor, 0, 0);
            c.fillStyle = '#666'; c.fillRect(7, 4, 2, 10);
            c.fillStyle = '#888'; c.fillRect(5, 12, 6, 2);
            c.fillStyle = '#444'; c.fillRect(6, 2, 4, 4);
            c.fillStyle = '#c86060'; c.fillRect(7, 3, 2, 2);
        });
        T.computer = this.make(S, S, c => {
            c.drawImage(T.floor, 0, 0);
            c.fillStyle = '#444'; c.fillRect(2, 2, 12, 8);
            c.fillStyle = '#6088b8'; c.fillRect(3, 3, 10, 6);
            c.fillStyle = '#666'; c.fillRect(6, 10, 4, 2);
            c.fillStyle = '#555'; c.fillRect(3, 12, 10, 2);
        });
        T.mat = this.make(S, S, c => {
            c.drawImage(T.floor, 0, 0);
            c.fillStyle = '#a890c0'; c.fillRect(1, 1, 14, 14);
            c.fillStyle = '#b8a4d4'; c.fillRect(2, 2, 12, 12);
        });

        // === BEDROOM TILES ===
        // Bed (cozy, unmade look)
        T.bed = this.make(S, S, c => {
            c.drawImage(T.floor, 0, 0);
            c.fillStyle = '#d8c0e8'; c.fillRect(1, 2, 14, 12); // blanket
            c.fillStyle = '#c8a8d8'; c.fillRect(2, 3, 12, 10);
            c.fillStyle = '#e8d8f0'; c.fillRect(2, 2, 12, 3);  // pillow
            c.fillStyle = '#f0e8f8'; c.fillRect(3, 3, 5, 2);    // pillow highlight
            c.fillStyle = '#b898c8'; c.fillRect(4, 8, 8, 2);    // fold
        });
        // Bed head (top part)
        T.bedHead = this.make(S, S, c => {
            c.drawImage(T.floor, 0, 0);
            c.fillStyle = '#8d6a42'; c.fillRect(1, 8, 14, 8); // headboard
            c.fillStyle = '#a07850'; c.fillRect(2, 9, 12, 6);
            c.fillStyle = '#e8d8f0'; c.fillRect(2, 11, 12, 5); // pillow top visible
            c.fillStyle = '#d8c0e8'; c.fillRect(3, 13, 10, 3);
        });
        // Window (with curtain and light)
        T.window = this.make(S, S, c => {
            c.fillStyle = '#96887a'; c.fillRect(0, 0, S, S); // wall bg
            c.fillStyle = '#b0d8f0'; c.fillRect(2, 2, 12, 10); // glass
            c.fillStyle = '#d0e8f8'; c.fillRect(3, 3, 10, 4);   // sky
            c.fillStyle = '#90c0d8'; c.fillRect(3, 7, 10, 4);   // lower sky
            c.fillStyle = '#FFE8C0'; c.fillRect(4, 3, 3, 2);     // sunlight
            c.fillStyle = '#6a4830'; c.fillRect(2, 1, 12, 1); c.fillRect(2, 12, 12, 1); // frame
            c.fillStyle = '#6a4830'; c.fillRect(1, 1, 1, 12); c.fillRect(14, 1, 1, 12);
            c.fillStyle = '#6a4830'; c.fillRect(7, 2, 2, 10); // cross bar
            // curtain tassels
            c.fillStyle = '#f0c0d0'; c.fillRect(2, 2, 2, 10);
            c.fillStyle = '#e0b0c0'; c.fillRect(12, 2, 2, 10);
        });
        // Lamp
        T.lamp = this.make(S, S, c => {
            c.drawImage(T.floor, 0, 0);
            c.fillStyle = '#6a4830'; c.fillRect(6, 8, 4, 8); // base
            c.fillStyle = '#FFE8C0'; c.fillRect(3, 2, 10, 6); // shade
            c.fillStyle = '#FFD890'; c.fillRect(4, 3, 8, 4);
            c.fillStyle = '#FFF0D0'; c.fillRect(6, 4, 4, 2); // light center
        });
        // Rug (soft pastel, bedroom)
        T.rug = this.make(S, S, c => {
            c.drawImage(T.floor, 0, 0);
            c.fillStyle = '#e8c8d8'; c.fillRect(1, 1, 14, 14);
            c.fillStyle = '#d8b0c8'; c.fillRect(2, 2, 12, 12);
            c.fillStyle = '#f0d8e8'; c.fillRect(4, 4, 8, 8);
        });
        // Shelf with items
        T.shelf = this.make(S, S, c => {
            c.fillStyle = '#96887a'; c.fillRect(0, 0, S, S); // wall
            c.fillStyle = '#b0906a'; c.fillRect(1, 6, 14, 2); // shelf plank
            c.fillStyle = '#9a7a58'; c.fillRect(1, 12, 14, 2); // lower shelf
            // items on shelf
            c.fillStyle = '#c86060'; c.fillRect(3, 3, 3, 3); // small box
            c.fillStyle = '#6088b8'; c.fillRect(8, 4, 2, 2); // tiny bottle
            c.fillStyle = '#FFB0C0'; c.fillRect(11, 2, 3, 4); // photo frame
            c.fillStyle = '#58a048'; c.fillRect(2, 9, 3, 3); // plant
            c.fillStyle = '#68b858'; c.fillRect(3, 8, 2, 1); // leaf
            c.fillStyle = '#d4c09a'; c.fillRect(7, 10, 4, 2); // book
        });
        // Interior wall (warm)
        T.wallBedroom = this.make(S, S, c => {
            c.fillStyle = '#c8b8a8'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#b8a898';[[3, 2], [9, 6], [5, 10], [12, 14]].forEach(([x, y]) => c.fillRect(x, y, 1, 1));
        });
        // Vedi house exterior (warm orange tones)
        T.wallVedi = this.make(S, S, c => {
            c.fillStyle = '#d4a870'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#c49860';
            for (let y = 0; y < S; y += 4) { const o = (y % 8 === 0) ? 0 : 4; for (let x = o; x < S; x += 8)c.fillRect(x, y, 7, 3); }
            c.fillStyle = '#b48850'; for (let y = 3; y < S; y += 4)c.fillRect(0, y, S, 1);
        });
        // Vedi interior wall (warm, cozy)
        T.wallVediInt = this.make(S, S, c => {
            c.fillStyle = '#e8d0b0'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#d8c0a0';[[4, 3], [10, 7], [2, 12], [13, 5]].forEach(([x, y]) => c.fillRect(x, y, 1, 1));
        });
        // Couch
        T.couch = this.make(S, S, c => {
            c.drawImage(T.floor, 0, 0);
            c.fillStyle = '#b06040'; c.fillRect(1, 4, 14, 10);
            c.fillStyle = '#c87050'; c.fillRect(2, 5, 12, 8);
            c.fillStyle = '#d88060'; c.fillRect(3, 6, 10, 4); // cushion
            c.fillStyle = '#e09070'; c.fillRect(4, 6, 3, 3); c.fillRect(9, 6, 3, 3);
        });
        // Mailbox
        T.mailbox = this.make(S, S, c => {
            c.drawImage(T.grass, 0, 0);
            c.fillStyle = '#6a4830'; c.fillRect(7, 6, 2, 10); // post
            c.fillStyle = '#c86060'; c.fillRect(3, 2, 10, 5); // box
            c.fillStyle = '#b05050'; c.fillRect(4, 3, 8, 3);
            c.fillStyle = '#FFD070'; c.fillRect(5, 4, 2, 1); // flag
        });
        // Flower bed
        T.flowerBed = this.make(S, S, c => {
            c.fillStyle = '#5a4a30'; c.fillRect(0, 0, S, S); // soil
            c.fillStyle = '#6a5a40'; c.fillRect(0, 0, S, 8);
            [[2, 2, '#FFB0C0'], [6, 1, '#FFD080'], [10, 3, '#E0B0FF'], [14, 2, '#FF90A8']].forEach(([x, y, col]) => {
                c.fillStyle = '#58a048'; c.fillRect(x, y + 3, 2, 4); // stem
                c.fillStyle = '#68b858'; c.fillRect(x - 1, y + 4, 1, 1); // leaf
                c.fillStyle = col; c.fillRect(x - 1, y, 3, 3); // flower
                c.fillStyle = '#FFE8A0'; c.fillRect(x, y + 1, 1, 1); // center
            });
        });

        // === RESIDENTIAL TILES ===
        T.road = this.make(S, S, c => {
            c.fillStyle = '#444'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#4a4a4a';[[2, 3], [10, 11], [5, 5], [13, 1]].forEach(([x, y]) => c.fillRect(x, y, 1, 1));
        });
        T.roadLine = this.make(S, S, c => {
            c.drawImage(T.road, 0, 0);
            c.fillStyle = '#aaa'; c.fillRect(7, 4, 2, 8);
        });
        T.sidewalk = this.make(S, S, c => {
            c.fillStyle = '#bbb'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#a8a8a8'; c.fillRect(0, 0, 1, S); c.fillRect(0, 0, S, 1);
            c.fillRect(S - 1, 0, 1, S); c.fillRect(0, S - 1, S, 1);
        });
        T.aptWallBlue = this.make(S, S, c => {
            c.fillStyle = '#5078a0'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#4a6888'; for (let y = 0; y < S; y += 4)c.fillRect(0, y, S, 1);
        });
        T.aptWallGrey = this.make(S, S, c => {
            c.fillStyle = '#888'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#777'; for (let y = 0; y < S; y += 4)c.fillRect(0, y, S, 1);
        });
        T.aptDoor = this.make(S, S, c => {
            c.fillStyle = '#888'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#5a3a2a'; c.fillRect(3, 2, 10, 14);
            c.fillStyle = '#7a5a4a'; c.fillRect(4, 3, 8, 12);
        });
        T.garage = this.make(S, S, c => {
            c.fillStyle = '#666'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#555';[[4, 4], [12, 12]].forEach(([x, y]) => c.fillRect(x, y, 1, 1));
        });
        T.boundaryWall = this.make(S, S, c => {
            c.fillStyle = '#aaa'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#999'; c.fillRect(0, 0, S, 4);
            c.fillStyle = '#888'; c.fillRect(0, 3, S, 1);
        });
        T.shopSign = this.make(S, S, c => {
            c.fillStyle = '#888'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#e86060'; c.fillRect(2, 2, 12, 6);
            c.fillStyle = '#fff'; c.font = '6px sans-serif'; c.fillText('SHOP', 3, 7);
        });
        T.pylon = this.make(S, S, c => {
            c.drawImage(this.tiles.road || this.tiles.grass, 0, 0); // Background
            c.fillStyle = '#666'; c.fillRect(7, 0, 2, S);
            c.fillStyle = '#444'; c.fillRect(4, 2, 8, 2);
        });

        // === INTERIOR TILES ===
        T.stairs = this.make(S, S, c => {
            c.fillStyle = '#6a4a3a'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#4a2a1a'; for (let y = 0; y < S; y += 4) c.fillRect(0, y, S, 1);
        });
        T.kitchenCounter = this.make(S, S, c => {
            c.fillStyle = '#ddd'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#bbb'; c.fillRect(0, 0, S, 2);
        });
        T.sink = this.make(S, S, c => {
            c.drawImage(T.kitchenCounter, 0, 0);
            c.fillStyle = '#88c'; c.fillRect(4, 4, 8, 6);
            c.fillStyle = '#aaa'; c.fillRect(7, 2, 2, 3);
        });
        T.closet = this.make(S, S, c => {
            c.fillStyle = '#8a5a4a'; c.fillRect(0, 0, S, S);
            c.fillStyle = '#7a4a3a'; c.fillRect(2, 2, 12, 14);
            c.fillStyle = '#ffd070'; c.fillRect(11, 8, 1, 2); // handle
        });

        // Parked Vehicles...

        // Parked Vehicles (Static tiles)
        T.scootyParked = this.make(S, S, c => {
            // Background (road or garage)
            c.fillStyle = '#666'; c.fillRect(0, 0, S, S);
            this.drawVehicle(c, 'scooty', 'down');
        });
        T.carParked = this.make(S, S, c => {
            // Background (road or garage)
            c.fillStyle = '#666'; c.fillRect(0, 0, S, S);
            this.drawVehicle(c, 'car', 'down');
        });
    },

    drawVehicle(ctx, type, dir) {
        const S = 16;
        if (type === 'scooty') {
            ctx.fillStyle = '#e86060'; // Red scooty
            if (dir === 'up' || dir === 'down') {
                ctx.fillRect(5, 2, 6, 12); // body
                ctx.fillStyle = '#333'; ctx.fillRect(6, 4, 4, 6); // seat
                ctx.fillStyle = '#888'; ctx.fillRect(4, 3, 8, 1); // handlebars
            } else {
                ctx.fillRect(2, 5, 12, 6); // body
                ctx.fillStyle = '#333'; ctx.fillRect(4, 6, 6, 4); // seat
                ctx.fillStyle = '#888'; ctx.fillRect(10, 4, 1, 8); // handlebars
            }
        } else if (type === 'car') {
            ctx.fillStyle = '#5078a8'; // Blue car
            if (dir === 'up' || dir === 'down') {
                ctx.fillRect(3, 1, 10, 14); // body
                ctx.fillStyle = '#88aadd'; ctx.fillRect(4, 3, 8, 4); // windshield
                ctx.fillStyle = '#333'; ctx.fillRect(2, 3, 1, 3); ctx.fillRect(13, 3, 1, 3); // wheels
            } else {
                ctx.fillRect(1, 3, 14, 10); // body
                ctx.fillStyle = '#88aadd'; ctx.fillRect(3, 4, 4, 8); // windshield
                ctx.fillStyle = '#333'; ctx.fillRect(3, 2, 3, 1); ctx.fillRect(3, 13, 3, 1); // wheels
            }
        }
    },

    makeVehicles() {
        const S = 16;
        this.vehicles = {};

        ['scooty', 'car'].forEach(type => {
            ['down', 'up', 'left', 'right'].forEach(dir => {
                this.vehicles[`vehicle_${type}_${dir}`] = this.make(S, S, ctx => this.drawVehicle(ctx, type, dir));
            });
        });
    },

    // ===== CHARACTER SPRITES (16×16) =====
    makeCharacters() {
        const npcs = {
            luna: { hair: '#5b7fc9', skin: '#f0d0b0', eyes: '#5b7fc9', shirt: '#90c8e0', pants: '#6888a0', shoes: '#4a4a5a', fem: true },
            kai: { hair: '#3d3d3d', skin: '#d4a276', eyes: '#3d3d3d', shirt: '#58a048', pants: '#5C6378', shoes: '#3d3d3d', fem: false },
            mira: { hair: '#c86060', skin: '#f8e0c8', eyes: '#c86060', shirt: '#FFB0C0', pants: '#a06878', shoes: '#6a4830', fem: true },
            rex: { hair: '#d4a030', skin: '#f0d0b0', eyes: '#8B6F4E', shirt: '#e8a848', pants: '#5C6378', shoes: '#6a4830', fem: false },
            vedi: { hair: '#2a2a2a', skin: '#d4a276', eyes: '#3d3d3d', shirt: '#5078a8', pants: '#3d4a5c', shoes: '#3d3d3d', fem: false },
            npc_generic: { hair: '#7a7a7a', skin: '#f0d0b0', eyes: '#555', shirt: '#96887a', pants: '#5C6378', shoes: '#4a4a5a', fem: false },
        };
        Object.entries(npcs).forEach(([id, col]) => {
            ['down', 'up', 'left', 'right'].forEach(dir => {
                this.chars[`${id}_${dir}`] = this.make(16, 16, ctx => this.drawChar(ctx, col, dir, 0));
            });
        });
    },

    // ===== 16×16 SHOGO CHARACTER =====
    makeShogo() {
        const S = 16;
        // Shogo palettes
        const palettes = {
            default: {
                hair: '#5C3520', hairDk: '#3A1E10', hairLt: '#7A4A30',
                skin: '#F0D0B0', skinSh: '#DDB898',
                eyes: '#3A1E10', eyeW: '#FFF',
                blush: '#F0A0A0',
                scarf: '#E8A0B8', scarfDk: '#C88098',
                shirt: '#F0E8D8', shirtDk: '#D8D0C0',
                skirt: '#5570A0', skirtDk: '#455888',
                boots: '#6A4830', bootsDk: '#503820',
                flower: '#FFB8C8', flowerC: '#FFE890',
            },
            casual: {
                hair: '#5C3520', hairDk: '#3A1E10', hairLt: '#7A4A30',
                skin: '#F0D0B0', skinSh: '#DDB898',
                eyes: '#3A1E10', eyeW: '#FFF',
                blush: '#F0A0A0',
                scarf: '#90c8e0', scarfDk: '#6888a0',
                shirt: '#6080b0', shirtDk: '#405080',
                skirt: '#3d4a5c', skirtDk: '#2d3a4c',
                boots: '#3d3d3d', bootsDk: '#2d2d2d',
                flower: '#90c8e0', flowerC: '#FFFFFF',
            }
        };

        const drawShogo = (ctx, dir, frame, state, P) => {
            if (state === 'sleeping') {
                // Lying down (rotated 90 deg basically)
                ctx.save();
                ctx.translate(16, 0); ctx.rotate(Math.PI / 2);
                // Draw a simplified "flattened" Shogo
                ctx.fillStyle = P.hair; ctx.fillRect(4, 2, 8, 8);
                ctx.fillStyle = P.skin; ctx.fillRect(4, 6, 8, 4);
                ctx.fillStyle = P.shirt; ctx.fillRect(4, 10, 8, 4);
                ctx.fillStyle = P.skirt; ctx.fillRect(3, 14, 10, 2);
                ctx.restore();
                return;
            }
            if (state === 'waking') {
                // Sitting up
                ctx.fillStyle = P.hair; ctx.fillRect(4, 2, 8, 6);
                ctx.fillStyle = P.skin; ctx.fillRect(4, 4, 8, 4);
                ctx.fillStyle = P.shirt; ctx.fillRect(4, 8, 8, 4);
                ctx.fillStyle = P.skirt; ctx.fillRect(3, 12, 10, 2);
                ctx.fillStyle = P.skin; ctx.fillRect(5, 14, 2, 2); ctx.fillRect(9, 14, 2, 2); // legs out
                return;
            }

            const lo = (state === 'walk' || state === 'run') ? (frame === 1 ? 1 : frame === 3 ? -1 : 0) : 0;
            const bob = (state === 'idle' && frame === 1) ? -1 : 0;

            if (dir === 'up') {
                // Hair (back view — covers most of head)
                ctx.fillStyle = P.hair;
                ctx.fillRect(4, 0 + bob, 8, 3); ctx.fillRect(3, 1 + bob, 10, 6);
                // Long hair sides
                ctx.fillRect(3, 6 + bob, 2, 3); ctx.fillRect(11, 6 + bob, 2, 3);
                ctx.fillStyle = P.hairDk;
                ctx.fillRect(5, 3 + bob, 6, 3);
                ctx.fillStyle = P.hairLt;
                ctx.fillRect(5, 1 + bob, 3, 1); ctx.fillRect(9, 2 + bob, 2, 1);
                // Flower
                ctx.fillStyle = P.flower; ctx.fillRect(11, 1 + bob, 2, 2);
                ctx.fillStyle = P.flowerC; ctx.fillRect(11, 1 + bob, 1, 1);
                // Scarf
                ctx.fillStyle = P.scarf; ctx.fillRect(4, 8 + bob, 8, 2);
                ctx.fillStyle = P.scarfDk; ctx.fillRect(5, 9 + bob, 6, 1);
                // Shirt
                ctx.fillStyle = P.shirt; ctx.fillRect(4, 10, 8, 2);
                ctx.fillStyle = P.shirtDk; ctx.fillRect(5, 11, 6, 1);
                // Skirt
                ctx.fillStyle = P.skirt; ctx.fillRect(4, 12, 8, 1);
                ctx.fillStyle = P.skirtDk; ctx.fillRect(3, 12, 10, 1);
                // Legs + boots
                ctx.fillStyle = P.skin; ctx.fillRect(5 + lo, 13, 2, 1); ctx.fillRect(9 - lo, 13, 2, 1);
                ctx.fillStyle = P.boots; ctx.fillRect(5 + lo, 14, 3, 2); ctx.fillRect(8 - lo, 14, 3, 2);
                return;
            }

            // Shadow
            ctx.fillStyle = 'rgba(0,0,0,0.06)'; ctx.fillRect(5, 15, 6, 1);

            if (dir === 'down' || dir === 'left' || dir === 'right') {
                const profile = (dir === 'left' || dir === 'right');
                const left = (dir === 'left');

                // --- HAIR ---
                ctx.fillStyle = P.hair;
                ctx.fillRect(4, 0 + bob, 8, 3);
                ctx.fillRect(3, 1 + bob, 10, 2);
                // Hair sides (long, flowing)
                if (!profile) {
                    ctx.fillRect(3, 1 + bob, 2, 5); ctx.fillRect(11, 1 + bob, 2, 5);
                } else {
                    const nearSide = left ? 3 : 11;
                    const farSide = left ? 11 : 3;
                    ctx.fillRect(nearSide, 1 + bob, 2, 5);
                    ctx.fillRect(farSide, 1 + bob, 2, 3);
                }
                ctx.fillStyle = P.hairLt;
                ctx.fillRect(5, 0 + bob, 2, 1); ctx.fillRect(9, 0 + bob, 2, 1);

                // --- FACE ---
                ctx.fillStyle = P.skin;
                ctx.fillRect(4, 3 + bob, 8, 4);
                // Bangs
                ctx.fillStyle = P.hairDk;
                ctx.fillRect(4, 2 + bob, 8, 2);
                ctx.fillStyle = P.hair;
                ctx.fillRect(5, 2 + bob, 6, 1);

                // --- EYES ---
                if (!profile) {
                    // Front facing — two eyes
                    ctx.fillStyle = P.eyeW;
                    ctx.fillRect(5, 4 + bob, 2, 2); ctx.fillRect(9, 4 + bob, 2, 2);
                    ctx.fillStyle = P.eyes;
                    ctx.fillRect(6, 4 + bob, 1, 2); ctx.fillRect(10, 4 + bob, 1, 2);
                    ctx.fillStyle = '#FFF';
                    ctx.fillRect(5, 4 + bob, 1, 1); ctx.fillRect(9, 4 + bob, 1, 1);
                    // Blush
                    ctx.fillStyle = P.blush;
                    ctx.fillRect(4, 6 + bob, 1, 1); ctx.fillRect(11, 6 + bob, 1, 1);
                } else {
                    // Profile — one eye
                    const ex = left ? 4 : 10;
                    ctx.fillStyle = P.eyeW; ctx.fillRect(ex, 4 + bob, 2, 2);
                    ctx.fillStyle = P.eyes; ctx.fillRect(ex, 4 + bob, 1, 2);
                    ctx.fillStyle = '#FFF'; ctx.fillRect(ex, 4 + bob, 1, 1);
                    ctx.fillStyle = P.blush; ctx.fillRect(left ? 4 : 11, 6 + bob, 1, 1);
                }
                // Mouth
                ctx.fillStyle = '#D0907A';
                const mx = profile ? (left ? 5 : 9) : 7;
                ctx.fillRect(mx, 6 + bob, 2, 1);

                // --- FLOWER ---
                if (!profile) {
                    ctx.fillStyle = P.flower; ctx.fillRect(11, 1 + bob, 2, 2);
                    ctx.fillStyle = P.flowerC; ctx.fillRect(12, 1 + bob, 1, 1);
                } else {
                    const fx = left ? 11 : 3;
                    ctx.fillStyle = P.flower; ctx.fillRect(fx, 0 + bob, 2, 2);
                    ctx.fillStyle = P.flowerC; ctx.fillRect(fx, 0 + bob, 1, 1);
                }

                // --- SCARF ---
                ctx.fillStyle = P.scarf;
                ctx.fillRect(4, 7 + bob, 8, 2);
                ctx.fillStyle = P.scarfDk;
                ctx.fillRect(5, 8 + bob, 6, 1);
                // Scarf tassels
                if (!profile) {
                    ctx.fillStyle = P.scarf;
                    ctx.fillRect(3, 8 + bob, 1, 2); ctx.fillRect(12, 8 + bob, 1, 2);
                }

                // --- SHIRT ---
                ctx.fillStyle = P.shirt;
                ctx.fillRect(4, 9, 8, 2);
                ctx.fillStyle = P.shirtDk;
                ctx.fillRect(5, 10, 6, 1);
                // Arms
                if (!profile) {
                    ctx.fillStyle = P.skin;
                    ctx.fillRect(3, 9, 1, 2); ctx.fillRect(12, 9, 1, 2);
                }

                // --- SKIRT ---
                ctx.fillStyle = P.skirt;
                ctx.fillRect(3, 11, 10, 1);
                ctx.fillStyle = P.skirtDk;
                ctx.fillRect(4, 11, 8, 1);

                // --- LEGS ---
                ctx.fillStyle = P.skin;
                ctx.fillRect(5 + lo, 12, 2, 1); ctx.fillRect(9 - lo, 12, 2, 1);

                // --- BOOTS ---
                ctx.fillStyle = P.boots;
                ctx.fillRect(5 + lo, 13, 3, 2); ctx.fillRect(8 - lo, 13, 3, 2);
                ctx.fillStyle = P.bootsDk;
                ctx.fillRect(5 + lo, 14, 3, 1); ctx.fillRect(8 - lo, 14, 3, 1);
            }
        };

        // --- GENERATE FRAMES ---
        const mirror = (c) => this.make(S, S, ctx => {
            ctx.translate(S, 0); ctx.scale(-1, 1); ctx.drawImage(c, 0, 0);
        });

        Object.entries(palettes).forEach(([id, P]) => {
            // Idle
            for (let f = 0; f < 2; f++) {
                ['down', 'up', 'left'].forEach(dir => {
                    const key = `player_${id}_idle_${dir}_${f}`;
                    this.chars[key] = this.make(S, S, ctx => drawShogo(ctx, dir, f, 'idle', P));
                    if (dir === 'left') this.chars[`player_${id}_idle_right_${f}`] = mirror(this.chars[key]);
                });
            }

            // Walk
            for (let f = 0; f < 4; f++) {
                ['down', 'up', 'left'].forEach(dir => {
                    const key = `player_${id}_walk_${dir}_${f}`;
                    this.chars[key] = this.make(S, S, ctx => drawShogo(ctx, dir, f, 'walk', P));
                    if (dir === 'left') this.chars[`player_${id}_walk_right_${f}`] = mirror(this.chars[key]);
                });
            }

            // Run reuses walk
            for (let f = 0; f < 4; f++) {
                ['down', 'up', 'left', 'right'].forEach(dir => {
                    this.chars[`player_${id}_run_${dir}_${f}`] = this.chars[`player_${id}_walk_${dir}_${f}`];
                });
            }

            // Swim
            for (let f = 0; f < 2; f++) {
                ['down', 'up', 'left'].forEach(dir => {
                    const key = `player_${id}_swim_${dir}_${f}`;
                    this.chars[key] = this.make(S, S, ctx => {
                        drawShogo(ctx, dir, f, 'idle', P);
                        ctx.fillStyle = '#6ab4d8'; ctx.fillRect(0, 10, S, 6);
                        ctx.fillStyle = '#80c8e8'; ctx.fillRect(2, 10, 4, 1); ctx.fillRect(10, 10, 4, 1);
                    });
                    if (dir === 'left') this.chars[`player_${id}_swim_right_${f}`] = mirror(this.chars[key]);
                });
            }

            // Single frame states
            ['sitting', 'pet', 'sleep', 'sleeping', 'waking', 'driving'].forEach(state => {
                ['down', 'up', 'left'].forEach(dir => {
                    const key = `player_${id}_${state}_${dir}_0`;
                    this.chars[key] = this.make(S, S, ctx => {
                        const s = (state === 'pet' || state === 'driving') ? 'idle' : state;
                        if (state === 'pet') {
                            ctx.save(); ctx.translate(0, 2); drawShogo(ctx, dir, 0, s, P);
                            ctx.fillStyle = P.skin; ctx.fillRect(12, 8, 2, 2); // extended arm
                            ctx.restore();
                        } else if (state === 'sleep') {
                            // Simplified lying down pose
                            ctx.fillStyle = P.hair; ctx.fillRect(1, 6, 6, 3);
                            ctx.fillStyle = P.skin; ctx.fillRect(4, 7, 4, 2);
                            ctx.fillStyle = P.scarf; ctx.fillRect(7, 7, 3, 2);
                            ctx.fillStyle = P.shirt; ctx.fillRect(9, 7, 4, 2);
                            ctx.fillStyle = P.skirt; ctx.fillRect(12, 7, 2, 2);
                            ctx.fillStyle = P.eyes; ctx.fillRect(5, 8, 1, 1);
                            ctx.fillStyle = '#D8C8B8'; ctx.fillRect(6, 9, 8, 4);
                        } else {
                            drawShogo(ctx, dir, 0, s, P);
                        }
                    });
                    if (dir === 'left') this.chars[`player_${id}_${state}_right_${0}`] = mirror(this.chars[key]);
                });
            });
        });
    },

    // ===== ANIMAL SPRITES =====
    makeAnimals() {
        const A = this.animals;

        // Puppy (small, cute, 10x10 centered in 16x16)
        A.puppy_idle = this.make(16, 16, c => {
            c.fillStyle = '#c8a070'; c.fillRect(4, 7, 8, 5);
            c.fillStyle = '#d8b080'; c.fillRect(5, 8, 6, 3);
            c.fillStyle = '#c8a070'; c.fillRect(5, 3, 7, 5);
            c.fillStyle = '#d8b080'; c.fillRect(6, 4, 5, 3);
            c.fillStyle = '#a08060'; c.fillRect(4, 2, 2, 3); c.fillRect(11, 2, 2, 3);
            c.fillStyle = '#2a2a2a'; c.fillRect(7, 5, 1, 1); c.fillRect(10, 5, 1, 1);
            c.fillStyle = '#fff'; c.fillRect(7, 5, 1, 1);
            c.fillStyle = '#4a3020'; c.fillRect(8, 6, 2, 1);
            c.fillStyle = '#a08060'; c.fillRect(5, 12, 2, 3); c.fillRect(9, 12, 2, 3);
            c.fillStyle = '#c8a070'; c.fillRect(11, 5, 2, 2);
        });

        A.puppy_happy = this.make(16, 16, c => {
            c.fillStyle = '#c8a070'; c.fillRect(4, 7, 8, 5);
            c.fillStyle = '#d8b080'; c.fillRect(5, 8, 6, 3);
            c.fillStyle = '#c8a070'; c.fillRect(5, 3, 7, 5);
            c.fillStyle = '#d8b080'; c.fillRect(6, 4, 5, 3);
            c.fillStyle = '#a08060'; c.fillRect(4, 2, 2, 3); c.fillRect(11, 2, 2, 3);
            c.fillStyle = '#2a2a2a'; c.fillRect(7, 5, 1, 1); c.fillRect(10, 5, 1, 1);
            c.fillStyle = '#4a3020'; c.fillRect(8, 6, 2, 1);
            c.fillStyle = '#ff8888'; c.fillRect(9, 7, 1, 2);
            c.fillStyle = '#a08060'; c.fillRect(5, 12, 2, 3); c.fillRect(9, 12, 2, 3);
            c.fillStyle = '#c8a070'; c.fillRect(12, 4, 2, 2);
        });

        // Cat (sitting, content)
        A.cat_idle = this.make(16, 16, c => {
            c.fillStyle = '#e0d0c0'; c.fillRect(4, 7, 8, 6);
            c.fillStyle = '#d0c0b0'; c.fillRect(5, 8, 6, 4);
            c.fillStyle = '#e0d0c0'; c.fillRect(5, 2, 6, 6);
            c.fillStyle = '#f0e0d0'; c.fillRect(6, 3, 4, 4);
            c.fillStyle = '#e0d0c0'; c.fillRect(4, 1, 2, 3); c.fillRect(10, 1, 2, 3);
            c.fillStyle = '#f0b0c0'; c.fillRect(5, 2, 1, 1); c.fillRect(10, 2, 1, 1);
            c.fillStyle = '#48a848'; c.fillRect(6, 4, 2, 1); c.fillRect(9, 4, 2, 1);
            c.fillStyle = '#1a1a1a'; c.fillRect(7, 4, 1, 1); c.fillRect(9, 4, 1, 1);
            c.fillStyle = '#e0a0a0'; c.fillRect(8, 5, 1, 1);
            c.fillStyle = '#c0b0a0'; c.fillRect(3, 5, 2, 1); c.fillRect(12, 5, 2, 1);
            c.fillStyle = '#d0c0b0'; c.fillRect(11, 10, 3, 1); c.fillRect(13, 9, 1, 1);
            c.fillStyle = '#f0e0d0'; c.fillRect(5, 12, 2, 2); c.fillRect(9, 12, 2, 2);
        });

        A.cat_happy = this.make(16, 16, c => {
            c.fillStyle = '#e0d0c0'; c.fillRect(4, 7, 8, 6);
            c.fillStyle = '#d0c0b0'; c.fillRect(5, 8, 6, 4);
            c.fillStyle = '#e0d0c0'; c.fillRect(5, 2, 6, 6);
            c.fillStyle = '#f0e0d0'; c.fillRect(6, 3, 4, 4);
            c.fillStyle = '#e0d0c0'; c.fillRect(4, 1, 2, 3); c.fillRect(10, 1, 2, 3);
            c.fillStyle = '#f0b0c0'; c.fillRect(5, 2, 1, 1); c.fillRect(10, 2, 1, 1);
            c.fillStyle = '#1a1a1a'; c.fillRect(6, 4, 2, 1); c.fillRect(9, 4, 2, 1);
            c.fillStyle = '#e0a0a0'; c.fillRect(8, 5, 1, 1);
            c.fillStyle = '#c0b0a0'; c.fillRect(3, 5, 2, 1); c.fillRect(12, 5, 2, 1);
            c.fillStyle = '#d0c0b0'; c.fillRect(11, 10, 3, 1); c.fillRect(13, 9, 1, 2);
            c.fillStyle = '#f0e0d0'; c.fillRect(5, 12, 2, 2); c.fillRect(9, 12, 2, 2);
        });

        // Bird (perched)
        A.bird = this.make(16, 16, c => {
            c.fillStyle = '#70a8d8'; c.fillRect(5, 6, 6, 4);
            c.fillStyle = '#88b8e0'; c.fillRect(6, 7, 4, 2);
            c.fillStyle = '#70a8d8'; c.fillRect(7, 3, 4, 4);
            c.fillStyle = '#88b8e0'; c.fillRect(8, 4, 2, 2);
            c.fillStyle = '#1a1a1a'; c.fillRect(9, 4, 1, 1);
            c.fillStyle = '#e8a848'; c.fillRect(11, 5, 2, 1);
            c.fillStyle = '#5888b0'; c.fillRect(3, 7, 3, 2);
            c.fillStyle = '#a08060'; c.fillRect(7, 10, 1, 3); c.fillRect(9, 10, 1, 3);
            c.fillStyle = '#5888b0'; c.fillRect(6, 7, 1, 2);
        });
    },

    drawChar(ctx, col, dir, frame) {
        const lo = frame === 1 ? 1 : frame === 2 ? -1 : 0;
        const fem = col.fem;

        if (dir === 'up') {
            ctx.fillStyle = col.hair;
            ctx.fillRect(4, 0, 8, 3); ctx.fillRect(3, 1, 10, 6);
            if (fem) { ctx.fillRect(3, 6, 2, 2); ctx.fillRect(11, 6, 2, 2); }
            ctx.fillStyle = col.shirt;
            if (fem) { ctx.fillRect(4, 7, 8, 5); ctx.fillRect(3, 9, 10, 3); }
            else { ctx.fillRect(4, 7, 8, 4); }
            ctx.fillStyle = col.shoes;
            ctx.fillRect(5 + lo, 12, 3, 3); ctx.fillRect(8 - lo, 12, 3, 3);
            return;
        }
        ctx.fillStyle = col.hair;
        ctx.fillRect(4, 0, 8, 3); ctx.fillRect(3, 1, 10, 2);
        ctx.fillStyle = col.skin;
        ctx.fillRect(4, 3, 8, 4);
        ctx.fillStyle = col.hair;
        if (dir === 'down') {
            ctx.fillRect(3, 1, 2, 4); ctx.fillRect(11, 1, 2, 4);
            if (fem) { ctx.fillRect(3, 5, 2, 3); ctx.fillRect(11, 5, 2, 3); }
        } else if (dir === 'left') {
            ctx.fillRect(3, 1, 2, fem ? 6 : 4);
            if (fem) ctx.fillRect(11, 1, 2, 3);
        } else {
            ctx.fillRect(11, 1, 2, fem ? 6 : 4);
            if (fem) ctx.fillRect(3, 1, 2, 3);
        }
        ctx.fillStyle = col.eyes;
        if (dir === 'down') { ctx.fillRect(5, 4, 2, 2); ctx.fillRect(9, 4, 2, 2); }
        else if (dir === 'left') { ctx.fillRect(4, 4, 2, 2); }
        else { ctx.fillRect(10, 4, 2, 2); }
        ctx.fillStyle = '#fff';
        if (dir === 'down') { ctx.fillRect(5, 4, 1, 1); ctx.fillRect(9, 4, 1, 1); }
        else if (dir === 'left') { ctx.fillRect(4, 4, 1, 1); }
        else { ctx.fillRect(10, 4, 1, 1); }
        ctx.fillStyle = '#d0907a'; const mx = dir === 'left' ? 5 : dir === 'right' ? 9 : 7;
        ctx.fillRect(mx, 6, 2, 1);
        ctx.fillStyle = col.shirt;
        if (fem) {
            ctx.fillRect(4, 7, 8, 4); ctx.fillRect(3, 9, 10, 3);
            ctx.fillRect(3, 11, 10, 1);
        } else {
            ctx.fillRect(4, 7, 8, 4);
            if (dir === 'left') ctx.fillRect(3, 7, 1, 3);
            if (dir === 'right') ctx.fillRect(12, 7, 1, 3);
        }
        if (!fem) { ctx.fillStyle = col.pants; ctx.fillRect(5 + lo, 11, 3, 3); ctx.fillRect(8 - lo, 11, 3, 3); }
        ctx.fillStyle = col.shoes;
        const fy = fem ? 12 : 14;
        ctx.fillRect(5 + lo, fy, 3, 16 - fy); ctx.fillRect(8 - lo, fy, 3, 16 - fy);
        if (fem && dir === 'down') { ctx.fillStyle = '#FFB0C0'; ctx.fillRect(11, 2, 2, 2); }
    }
};
