// ===== VEHICLE SYSTEM =====
const Vehicles = {
    riding: false,
    type: null, // 'scooty' | 'car'
    vediPassenger: false,
    x: 0, y: 0,
    px: 0, py: 0,
    dir: 'down',
    speed: 140, // pixels per second

    // Dynamic parked vehicles
    parked: {},

    init() {
        this.parked = {};
        for (let mapId in Maps.data) {
            const map = Maps.data[mapId];
            if (!map.objects) continue;
            this.parked[mapId] = [];

            const newObj = [];
            for (let y = 0; y < map.height; y++) {
                let row = map.objects[y].split('');
                for (let x = 0; x < map.width; x++) {
                    const char = row[x];
                    if (char === '8' || char === '@') {
                        const type = char === '8' ? 'scooty' : 'car';
                        this.parked[mapId].push({ id: `${type}_${mapId}_${x}_${y}`, type, x, y, dir: 'down' });
                        row[x] = '.'; // Remove tile from map data
                    }
                }
                newObj.push(row.join(''));
            }
            map.objects = newObj;
        }
    },

    mount(vehicle) {
        // Remove from parked list
        const p = this.parked[Maps.current];
        if (p) {
            const idx = p.findIndex(v => v.x === vehicle.x && v.y === vehicle.y);
            if (idx !== -1) p.splice(idx, 1);
        }

        this.riding = true;
        this.type = vehicle.type;
        this.x = vehicle.x;
        this.y = vehicle.y;
        this.px = vehicle.x * TILE;
        this.py = vehicle.y * TILE;
        this.dir = vehicle.dir;

        Player.setState('driving');
        Player.x = this.x;
        Player.y = this.y;
        Player.px = this.px;
        Player.py = this.py;

        Memory.set('drove_' + this.type);
        Engine.showToast(`Driving ${this.type}... [E] to exit`);
        AudioManager.playClick();
    },

    dismount() {
        if (!this.riding) return;

        const rx = Math.round(this.px / TILE);
        const ry = Math.round(this.py / TILE);

        // Add back to parked list
        if (!this.parked[Maps.current]) this.parked[Maps.current] = [];
        this.parked[Maps.current].push({
            id: `${this.type}_${Date.now()}`,
            type: this.type,
            x: rx, y: ry, dir: this.dir
        });

        this.riding = false;
        Player.x = rx;
        Player.y = ry;
        Player.px = rx * TILE;
        Player.py = ry * TILE;
        Player.setState('idle');

        if (this.vediPassenger) {
            this.vediPassenger = false;
            Memory.set('drove_with_vedi');
            Engine.showToast('Vedi stepped off.');
        }

        Engine.showToast('Dismounted.');
        AudioManager.playClick();
    },

    update(dt) {
        if (!this.riding) return;

        let moved = false;
        let dx = 0, dy = 0;

        if (Engine.keys['ArrowUp'] || Engine.keys['w'] || Engine.keys['W']) { dy = -1; this.dir = 'up'; moved = true; }
        else if (Engine.keys['ArrowDown'] || Engine.keys['s'] || Engine.keys['S']) { dy = 1; this.dir = 'down'; moved = true; }
        else if (Engine.keys['ArrowLeft'] || Engine.keys['a'] || Engine.keys['A']) { dx = -1; this.dir = 'left'; moved = true; }
        else if (Engine.keys['ArrowRight'] || Engine.keys['d'] || Engine.keys['D']) { dx = 1; this.dir = 'right'; moved = true; }

        if (moved) {
            const mag = Math.sqrt(dx * dx + dy * dy);
            const moveAmt = this.speed * dt;
            const npx = this.px + (dx / mag) * moveAmt;
            const npy = this.py + (dy / mag) * moveAmt;

            // Simple collision
            const tx = Math.floor((npx + 8) / TILE);
            const ty = Math.floor((npy + 8) / TILE);

            if (!Maps.isSolid(Maps.current, tx, ty)) {
                this.px = npx;
                this.py = npy;
                this.x = tx;
                this.y = ty;

                Player.px = this.px;
                Player.py = this.py;
                Player.x = this.x;
                Player.y = this.y;
            }
        }
    },

    render(ctx, camX, camY) {
        // Render parked vehicles
        const p = this.parked[Maps.current];
        if (p) {
            p.forEach(v => {
                const sx = Math.round(v.x * TILE - camX);
                const sy = Math.round(v.y * TILE - camY);
                const sprite = Sprites.vehicles?.[`vehicle_${v.type}_${v.dir}`];
                if (sprite) ctx.drawImage(sprite, sx, sy);
            });
        }

        if (this.riding) {
            const sx = Math.round(this.px - camX);
            const sy = Math.round(this.py - camY);
            const spriteKey = `vehicle_${this.type}_${this.dir}`;
            const sprite = Sprites.vehicles?.[spriteKey];
            if (sprite) ctx.drawImage(sprite, sx, sy - 4);
        }
    },

    checkNearby() {
        if (this.riding) return null;
        const p = this.parked[Maps.current];
        if (!p) return null;
        const ft = Player.getFacingTile();
        return p.find(v => (v.x === ft.x && v.y === ft.y) || (Math.abs(v.x - Player.x) <= 1 && Math.abs(v.y - Player.y) <= 1));
    },

    interact(vehicle) {
        // Shared ride logic
        const vedi = NPC.getNPC(Maps.current, vehicle.x - 1, vehicle.y) ||
            NPC.getNPC(Maps.current, vehicle.x + 1, vehicle.y) ||
            NPC.getNPC(Maps.current, vehicle.x, vehicle.y - 1) ||
            NPC.getNPC(Maps.current, vehicle.x, vehicle.y + 1) ||
            (Quests.companionNPC && Quests.companionNPC.id === 'vedi' ? Quests.companionNPC : null);

        if (vedi && vedi.id === 'vedi' && !this.vediPassenger) {
            Dialogue.show("Do you want Vedi to sit with you?", ["Yes!", "No, just me."], "Vedi", (idx) => {
                if (idx === 0) {
                    this.vediPassenger = true;
                    this.mount(vehicle);
                    Engine.showToast("Vedi hopped on!");
                } else {
                    this.mount(vehicle);
                }
            });
        } else {
            this.mount(vehicle);
        }
    }
};
