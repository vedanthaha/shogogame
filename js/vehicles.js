// ===== VEHICLE SYSTEM =====
var Vehicles = {
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

        // If carrying passenger, hide the map NPC
        if(this.vediPassenger) {
             const map = Maps.data[Maps.current];
             const vedi = map?.npcs?.find(n => n.id.includes('vedi') || n.sprite === 'vedi');
             if(vedi) vedi.hidden = true;
        }

        Engine.state = 'driving';
        Player.setState('driving');
        Player.x = this.x;
        Player.y = this.y;
        Player.px = this.px;
        Player.py = this.py;

        Memory.set('drove_' + this.type);
        Engine.showToast(`Driving ${this.type}... [E] exit, [L] passenger`);
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
        Engine.state = 'playing';
        Player.x = rx;
        Player.y = ry;
        Player.px = rx * TILE;
        Player.py = ry * TILE;
        Player.setState('idle');

        if (this.vediPassenger) {
            this.vediPassenger = false;
            // Respawn Vedi NPC at exit point
            const map = Maps.data[Maps.current];
            const vedi = map?.npcs?.find(n => n.id.includes('vedi') || n.sprite === 'vedi');
            if(vedi) {
                 vedi.hidden = false;
                 // Place her slightly to the side
                 vedi.x = rx + (this.dir === 'left' ? 1 : -1); 
                 vedi.y = ry;
                 vedi.dir = (this.dir === 'up' ? 'down' : 'up'); // face player
            }

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

        if (Engine.keys['ArrowUp'] || Engine.keys['w'] || Engine.keys['W']) { dy = -1; this.dir = 'up'; Player.dir = 'up'; moved = true; }
        else if (Engine.keys['ArrowDown'] || Engine.keys['s'] || Engine.keys['S']) { dy = 1; this.dir = 'down'; Player.dir = 'down'; moved = true; }
        else if (Engine.keys['ArrowLeft'] || Engine.keys['a'] || Engine.keys['A']) { dx = -1; this.dir = 'left'; Player.dir = 'left'; moved = true; }
        else if (Engine.keys['ArrowRight'] || Engine.keys['d'] || Engine.keys['D']) { dx = 1; this.dir = 'right'; Player.dir = 'right'; moved = true; }

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
            
            if (sprite) {
                if(this.type === 'car') {
                    // Offset for 32x32 car sprite to center on 16x16 tile
                    ctx.drawImage(sprite, sx - 8, sy - 10);
                } else {
                    ctx.drawImage(sprite, sx, sy - 4);
                }
            }

            // Draw Shogo on top of vehicle
            const shogoKey = Player.getSprite();
            const shogoSprite = Sprites.chars[shogoKey];
            if (shogoSprite) {
                // Offset Shogo slightly differently based on vehicle type
                // For car, Shogo should be slightly higher to look like sitting inside
                const ox = 0, oy = (this.type === 'scooty' ? -6 : -6);
                ctx.drawImage(shogoSprite, sx + ox, sy + oy);
            }

            // Draw Vedi if passenger
            if (this.vediPassenger) {
                const vediSprite = Sprites.chars[`vedi_${this.dir}`];
                if (vediSprite) {
                    const vx = (this.type === 'scooty' ? (this.dir === 'up' || this.dir === 'down' ? 0 : (this.dir === 'left' ? 4 : -4)) : (this.dir === 'left' || this.dir === 'right' ? 4 : 4));
                    const vy = (this.type === 'scooty' ? 2 : -6);
                    ctx.drawImage(vediSprite, sx + vx, sy + vy);
                }
            }
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
        // If already have Vedi as passenger, just mount
        if (this.vediPassenger) { this.mount(vehicle); return; }

        // Find Vedi within 5 tiles
        const map = Maps.data[Maps.current];
        const vedi = map?.npcs?.find(n =>
            (n.id.includes('vedi') || n.sprite === 'vedi') &&
            !n.hidden &&
            Math.abs(n.x - vehicle.x) <= 5 &&
            Math.abs(n.y - vehicle.y) <= 5
        );

        if (vedi) {
            Dialogue.show("Vedi is nearby! Want her to come with you?", ["Yes, let's go!", "Nah, solo ride."], "Vedi", (idx) => {
                Engine.keys['e'] = false;
                Engine.keys['E'] = false;
                if (idx === 0) {
                    this.vediPassenger = true;
                    vedi.hidden = true;
                    this.mount(vehicle);
                } else {
                    this.mount(vehicle);
                }
            });
        } else {
            this.mount(vehicle);
        }
    },

    togglePassenger() {
        if (!this.riding) return;

        // Check if Vedi is nearby (within 3 tiles)
        const map = Maps.data[Maps.current];
        const vedi = map?.npcs?.find(n => n.id === 'vedi' || n.name === 'Vedi');
        
        if (!vedi) {
            Engine.showToast("Vedi isn't here.");
            return;
        }

        const dist = Math.abs(this.x - vedi.x) + Math.abs(this.y - vedi.y);
        
        if (this.vediPassenger) {
            // Get off logic: Handled by dismount or manual get off?
            // "L" to toggle.
            this.vediPassenger = false;
            vedi.hidden = false;
            vedi.x = this.x + (this.dir === 'left' ? 1 : -1);
            vedi.y = this.y;
            Engine.showToast("Vedi got out.");
        } else {
            if (dist > 4) {
                Engine.showToast("Vedi is too far away.");
                return;
            }
            this.vediPassenger = true;
            vedi.hidden = true;
            Engine.showToast("Vedi hopped in!");
            // Check potential quest completion for getting in car?
            // "vedi_highway_drive" quest might need this state.
            // If there's an active quest step to "Pick up Vedi", we can advance.
        }
    },
};
