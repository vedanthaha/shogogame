// ===== PLAYER (animation state machine, 16×16) =====
const Player = {
    x: 6, y: 27, px: 0, py: 0, targetX: 6, targetY: 27,
    dir: 'down', moving: false,
    walkSpeed: 80, runSpeed: 140, swimSpeed: 50,
    vibeEnergy: 50, maxVibe: 100, helpedNPCs: new Set(),

    // Animation state machine
    animState: 'idle', // idle, walk, run, swim, sit, pet, sleep, jump
    animFrame: 0, animTimer: 0,
    idleTimer: 0,
    running: false,

    // Frame counts & speeds per state
    animData: {
        idle: { frames: 2, speed: 0.3 },
        walk: { frames: 3, speed: 0.15 },
        run: { frames: 3, speed: 0.10 },
        swim: { frames: 2, speed: 0.25 },
        sit: { frames: 1, speed: 1 },
        driving: { frames: 1, speed: 1 },
        pet: { frames: 1, speed: 1 },
        sleep: { frames: 1, speed: 1 },
        sleeping: { frames: 1, speed: 1 },
        waking: { frames: 1, speed: 1 },
    },

    outfit: 'default', // 'default' or 'casual'

    init(sx, sy) {
        this.x = sx; this.y = sy; this.targetX = sx; this.targetY = sy;
        this.px = sx * TILE; this.py = sy * TILE;
        this.moving = false; this.animFrame = 0; this.animState = 'idle';
    },

    // === ANIMATION STATE ===
    setState(newState) {
        if (this.animState !== newState) {
            this.animState = newState;
            this.animFrame = 0;
            this.animTimer = 0;
        }
    },

    getSprite() {
        const s = this.animState;
        const d = this.dir;
        const f = this.animFrame;
        const o = this.outfit || 'default';
        return `player_${o}_${s}_${d}_${f}`;
    },

    // === UPDATE ===
    update(dt) {
        if (Engine.state !== 'playing' && Engine.state !== 'swimming' && Engine.state !== 'intro_wake') return;

        // Track Shift for running
        this.running = !!(Engine.keys['Shift'] || Engine.keys['ShiftLeft'] || Engine.keys['ShiftRight']);

        // Advance animation frame
        const ad = this.animData[this.animState];
        if (ad) {
            this.animTimer += dt;
            if (this.animTimer >= ad.speed) {
                this.animTimer -= ad.speed;
                this.animFrame = (this.animFrame + 1) % ad.frames;
            }
        }

        // === MOVEMENT ===
        if (this.moving) {
            const tx = this.targetX * TILE, ty = this.targetY * TILE;
            const isSwim = Engine.state === 'swimming';
            const spd = isSwim ? this.swimSpeed : (this.running ? this.runSpeed : this.walkSpeed);
            const dx = tx - this.px, dy = ty - this.py, step = spd * dt;

            if (Math.abs(dx) <= step && Math.abs(dy) <= step) {
                this.px = tx; this.py = ty;
                this.x = this.targetX; this.y = this.targetY;
                this.moving = false;
                this.checkDoor();
                // Update swim state after landing
                const g = Maps.getGround(Maps.current, this.x, this.y);
                if (g === 'W' && Engine.state !== 'swimming') {
                    Engine.state = 'swimming';
                    this.setState('swim');
                    Engine.showToast("Swimming!");
                } else if (g !== 'W' && Engine.state === 'swimming') {
                    Engine.state = 'playing';
                    this.setState('idle');
                }
            } else {
                if (dx !== 0) this.px += Math.sign(dx) * step;
                if (dy !== 0) this.py += Math.sign(dy) * step;
            }

            // Set movement animation state
            if (this.moving) {
                if (Engine.state === 'swimming') this.setState('swim');
                else if (this.running) this.setState('run');
                else this.setState('walk');
            }
            return;
        }

        // === IDLE / INPUT ===
        let nx = this.x, ny = this.y;
        if (Engine.keys['ArrowUp'] || Engine.keys['w'] || Engine.keys['W']) { ny--; this.dir = 'up'; }
        else if (Engine.keys['ArrowDown'] || Engine.keys['s'] || Engine.keys['S']) { ny++; this.dir = 'down'; }
        else if (Engine.keys['ArrowLeft'] || Engine.keys['a'] || Engine.keys['A']) { nx--; this.dir = 'left'; }
        else if (Engine.keys['ArrowRight'] || Engine.keys['d'] || Engine.keys['D']) { nx++; this.dir = 'right'; }

        if (nx !== this.x || ny !== this.y) {
            if (!this.isBlocked(nx, ny)) {
                this.targetX = nx; this.targetY = ny;
                this.moving = true;
                this.animTimer = 0;
                // Set state based on context
                if (Engine.state === 'swimming') this.setState('swim');
                else if (this.running) this.setState('run');
                else this.setState('walk');
            }
        } else if (!this.moving) {
            // No input = idle
            if (Engine.state === 'swimming') this.setState('swim');
            else this.setState('idle');
        }
    },

    isBlocked(tx, ty) {
        if (Maps.isSolid(Maps.current, tx, ty)) return true;
        const map = Maps.data[Maps.current];
        if (map && map.npcs && map.npcs.some(n => n.x === tx && n.y === ty)) return true;
        if (map && map.animals && map.animals.some(a => a.x === tx && a.y === ty)) return true;
        return false;
    },

    checkDoor() {
        const door = Maps.getDoor(Maps.current, this.x, this.y);
        if (door) {
            const obj = Maps.getObject(Maps.current, this.x, this.y);
            const type = obj === 'H' ? 'stairs' : 'door';
            Engine.transitionTo(door.target, door.spawnX, door.spawnY, type);
        }
    },

    getFacingTile() {
        const dx = this.dir === 'left' ? -1 : this.dir === 'right' ? 1 : 0;
        const dy = this.dir === 'up' ? -1 : this.dir === 'down' ? 1 : 0;
        return { x: this.x + dx, y: this.y + dy };
    },

    // === INTERACTION ===
    interact() {
        if (this.moving) return;
        const ft = this.getFacingTile();

        // PC Interaction
        if (Maps.current === 'shogo_bedroom' && ft.x === 6 && ft.y === 5) {
            PC.open();
            return;
        }

        // Check Quests First
        if (Quests.checkInteract(Maps.current, ft.x, ft.y)) return;

        const obj = Maps.getObject(Maps.current, ft.x, ft.y);

        // NPC
        const npc = Maps.getNPC(Maps.current, ft.x, ft.y);
        if (npc) { NPC.interact(npc); return; }

        // Animal petting
        const animal = Maps.getAnimal(Maps.current, ft.x, ft.y);
        if (animal) {
            this.setState('pet');
            NPC.petAnimal(animal);
            // Return to idle after reaction
            setTimeout(() => { if (this.animState === 'pet') this.setState('idle'); }, 1500);
            return;
        }

        // Sign
        const sign = Maps.getSign(Maps.current, ft.x, ft.y);
        if (sign) { Dialogue.show(sign.text, null, 'Sign'); return; }

        // Interactable furniture
        const inter = Maps.getInteractable(Maps.current, ft.x, ft.y);
        if (inter) { Engine.showToast(inter.text); return; }

        // Closet check
        if (obj === 'l') {
            Dialogue.show("Change your outfit?", ["Default Look", "Cosy Blue"], "Closet", (idx) => {
                this.outfit = idx === 0 ? 'default' : 'casual';
                Engine.showToast("Looking good!");
                AudioManager.playVibeUp();
            });
            return;
        }

        // Bed (sleep)
        if (obj === 'E') {
            this.setState('sleep');
            Engine.state = 'sitting';
            Engine.showToast("Zzz... resting...");
            return;
        }

        // Bench sitting
        if (obj === 'b') { this.sitDown(); return; }

        // Sit on grass
        const g = Maps.getGround(Maps.current, this.x, this.y);
        if (g === 'G' || g === 'F') { this.sitDown(); return; }
    },

    sit() {
        // If riding a vehicle, sit acts as dismount
        if (Engine.state === 'driving') {
             Vehicles.dismount();
             return;
        }
        
        if (Engine.state !== 'playing') return;
        this.sitDown();
    },

    sitDown() {
        this.setState('sit');
        Engine.state = 'sitting';
        const thoughts = [
            "The breeze feels nice...", "A quiet moment...",
            "Just breathing...", "Small things matter.",
            "This is enough.", "I like it here.",
        ];
        // Check if sitting on a parked vehicle
        const v = Vehicles.checkNearby(); 
        // Logic: if on top of a parked vehicle, we are technically 'sitting' on it visually.
        // The vehicle remains in 'parked' list so it renders. 
        // The player renders on top.
        Engine.showToast(thoughts[Math.floor(Math.random() * thoughts.length)]);
    },

    standUp() {
        Engine.state = 'playing';
        const g = Maps.getGround(Maps.current, this.x, this.y);
        if (g === 'W') Engine.state = 'swimming';
        this.setState('idle');
    },

    // === RENDER (16×16 at tile position) ===
    render(ctx, camX, camY) {
        if (Vehicles.riding) return; // Hide player sprite from here when riding, handled by vehicle
        
        let sx = Math.round(this.px - camX);
        let sy = Math.round(this.py - camY);

        // Visual fix: If sitting on a vehicle/bench, lift up slightly
        if (this.animState === 'sit') {
            // Find if we are sitting ON a vehicle
            const parked = Vehicles.parked[Maps.current] || [];
            const v = parked.find(pv => pv.x === this.x && pv.y === this.y);
            
            // Also check for bench 'b'
            const obj = Maps.getObject(Maps.current, this.x, this.y);
            
            if (v || obj === 'b') {
                sy -= 5; // Lift up to show vehicle/bench underneath
            }
        }

        const key = this.getSprite();
        const sprite = Sprites.chars[key];
        if (sprite) ctx.drawImage(sprite, sx, sy);
    },

    addVibe(amount) {
        this.vibeEnergy = Math.min(this.maxVibe, this.vibeEnergy + amount);
    }
};
