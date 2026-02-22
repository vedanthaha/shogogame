// ===== COZY STORY ENGINE =====
const Engine = {
    canvas: null, ctx: null, W: 480, H: 270,
    camX: 0, camY: 0, keys: {}, state: 'intro_black',
    lastTime: 0, time: 0,
    toastText: '', toastTimer: 0,
    anchorTriggered: false,
    transitionAlpha: 0, transitionTarget: null, transitionSpawn: null, transitionPhase: '',
    petals: [], showMinimap: true, reactions: [],
    fontReady: false,
    _tc: {}, _tmpC: null, _tmpX: null,

    // Intro sequence state
    introPhase: 0, introTimer: 0,
    introLines: [
        "A new day...",
        "I should get up.",
    ],
    introLineIndex: 0, introFadeAlpha: 1,

    async init() {
        this.canvas = document.getElementById('game');
        this.ctx = this.canvas.getContext('2d');

        // Internal resolution is fixed — never changes
        this.canvas.width = this.W;
        this.canvas.height = this.H;
        this.ctx.imageSmoothingEnabled = false;

        // Fullscreen scaling: CSS scales the canvas, internal res stays fixed
        const resize = () => {
            const dpr = window.devicePixelRatio || 1;
            const screenW = window.innerWidth;
            const screenH = window.innerHeight;

            // Calculate the largest integer scale that fits the screen
            // This ensures every game pixel maps to NxN screen pixels (crisp)
            const scaleX = screenW / this.W;
            const scaleY = screenH / this.H;
            const scale = Math.max(1, Math.floor(Math.min(scaleX, scaleY)));

            // If integer scale leaves too much black border, allow fractional
            // but prefer integer for pixel-perfect rendering
            let finalScale = scale;
            const intCoverage = (this.W * scale * this.H * scale) / (screenW * screenH);
            if (intCoverage < 0.6) {
                // Fall back to fractional scale to fill more screen
                finalScale = Math.min(scaleX, scaleY);
            }

            const displayW = Math.round(this.W * finalScale);
            const displayH = Math.round(this.H * finalScale);

            // CSS dimensions control display size
            this.canvas.style.width = displayW + 'px';
            this.canvas.style.height = displayH + 'px';

            // Ensure no canvas element size changes (internal stays fixed)
            this.canvas.width = this.W;
            this.canvas.height = this.H;
            this.ctx.imageSmoothingEnabled = false;
        };
        resize(); window.addEventListener('resize', resize);

        if (document.fonts) {
            try { await document.fonts.load('8px "Press Start 2P"'); this.fontReady = true; }
            catch (e) { this.fontReady = true; }
        } else { this.fontReady = true; }

        this._tmpC = document.createElement('canvas');
        this._tmpX = this._tmpC.getContext('2d');

        window.addEventListener('keydown', e => {
            this.keys[e.key] = true;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.preventDefault();
            
            // === PC INPUT ===
            if (this.state === 'pc') { PC.handleKey(e.key); return; }

            if (e.key === ' ' || e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
                if (this.state === 'intro_black') { this.advanceIntro(); return; }
                if (this.state === 'intro_wake') { this.wakeUp(); return; }
                if (this.state === 'dialogue') Dialogue.handleKey(e.key);
                else if (this.state === 'questlog') { Quests.toggleLog(); return; }
                else if (this.state === 'playing' || this.state === 'swimming' || this.state === 'driving') {
                    // Check for vehicle nearby
                    const v = Vehicles.checkNearby();
                    if (v && !Vehicles.riding) { Vehicles.interact(v); return; }
                    if (Vehicles.riding) { Vehicles.dismount(); return; }
                    Player.interact();
                }
                else if (this.state === 'sitting') { Player.standUp(); return; }
                else if (this.state === 'worldmap') { this.travelToSelected(); return; }
            }
            if (this.state === 'dialogue' && (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'w' || e.key === 's'))
                Dialogue.handleKey(e.key);
            if (e.key === 'q' || e.key === 'Q') {
                if (['playing', 'swimming', 'driving', 'questlog'].includes(this.state)) Quests.toggleLog();
            }
            if (e.key === 'f' || e.key === 'F') Quests.toggleLog();
            if (e.key === 'p' || e.key === 'P') Debug.toggle();
            if (e.key === 'Escape' && this.state === 'questlog') Quests.toggleLog();
            if (e.key === 'm' || e.key === 'M') {
                if (['playing', 'swimming', 'driving', 'worldmap'].includes(this.state)) this.toggleWorldMap();
            }
            if (e.key === 'Escape' && this.state === 'worldmap') this.toggleWorldMap();
            if (this.state === 'worldmap' && (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'ArrowDown' || e.key === 's')) {
                this.mapSelection = (this.mapSelection + (e.key.includes('Up') || e.key === 'w' ? -1 : 1) + 3) % 3;
            }
        });
        window.addEventListener('keyup', e => { this.keys[e.key] = false; });

        AudioManager.init(); Sprites.init(); Maps.buildObjects(); Memory.init(); Vehicles.init(); await NPC.loadDialogues(); await Quests.load();

        Maps.current = 'shogo_bedroom'; // Start at bedroom
        const s = Maps.data[Maps.current].playerStart;
        Player.init(s.x, s.y);
        Player.setState('sleeping'); // Start in sleeping pose

        this.initPetals(); this.updateCamera(1);
        this.lastTime = performance.now(); this.loop();
    },

    // ===== INTRO SEQUENCE =====
    advanceIntro() {
        this.introLineIndex++;
        if (this.introLineIndex >= this.introLines.length) {
            this.state = 'intro_wake';
            this.introPhase = 1;
            this.introTimer = 0;
            this.introFadeAlpha = 1;
        } else {
            this.introTimer = 0;
        }
    },

    wakeUp() {
        if (this.introPhase !== 2) return; // Must be fully faded in

        this.introPhase = 3;
        // Animation sequence
        (async () => {
            Player.setState('waking');
            await new Promise(r => setTimeout(r, 1000));
            Player.setState('idle');
            AudioManager.playSuccess();
            AudioManager.startBGM();
            await new Promise(r => setTimeout(r, 500));
            this.state = 'playing';
            this.showToast("Good morning, Shogo!");
            
            // Start the first quest automatically
            setTimeout(() => {
                if(Quests && Quests.accept) Quests.accept("shogo_morning");
            }, 2000);
        })();
    },

    updateIntro(dt) {
        if (this.state === 'intro_black') {
            this.introTimer += dt;
            if (this.introTimer > 4.0) this.advanceIntro();
        } else if (this.state === 'intro_wake') {
            if (this.introPhase === 1) { // Fading in
                this.introFadeAlpha = Math.max(0, this.introFadeAlpha - dt * 0.5);
                if (this.introFadeAlpha <= 0) {
                    this.introPhase = 2;
                    this.showToast("Press [E] to wake up");
                }
            }
        }
    },

    renderIntro(ctx) {
        if (this.state === 'intro_black') {
            ctx.fillStyle = '#0a0810'; ctx.fillRect(0, 0, this.W, this.H);
            const line = this.introLines[this.introLineIndex];
            if (line) {
                const a = Math.min(1, this.introTimer * 1.5);
                ctx.globalAlpha = a > 2.5 ? Math.max(0, 3.5 - this.introTimer) : Math.min(1, a);
                this.drawText(ctx, line, this.W / 2, this.H / 2, '#d8c0e8', 10, 'center');
                ctx.globalAlpha = 1;
            }
        } else if (this.state === 'intro_wake') {
            this.renderGame(ctx);
            if (this.introPhase === 1) {
                ctx.fillStyle = `rgba(10,8,16,${this.introFadeAlpha})`;
                ctx.fillRect(0, 0, this.W, this.H);
            }
        }
    },

    // ===== BITMAP TEXT =====
    pxFont(sz) { return this.fontReady ? `${sz}px "Press Start 2P"` : sz + 'px monospace'; },

    drawText(ctx, text, x, y, color, sz, align) {
        if (!text) return;
        const key = text + '|' + color + '|' + sz;
        let e = this._tc[key];
        if (!e) {
            const tc = this._tmpX, font = this.pxFont(sz);
            tc.font = font;
            const tw = Math.ceil(tc.measureText(text).width);
            const w = tw + 6, h = sz + 6;
            this._tmpC.width = w; this._tmpC.height = h;
            tc.font = font; tc.textBaseline = 'alphabetic';
            const bx = 3, by = h - 2;
            tc.fillStyle = '#0a0810';
            tc.fillText(text, bx - 1, by); tc.fillText(text, bx + 1, by);
            tc.fillText(text, bx, by - 1); tc.fillText(text, bx, by + 1);
            tc.fillStyle = color;
            tc.fillText(text, bx, by);
            const img = tc.getImageData(0, 0, w, h), d = img.data;
            for (let i = 3; i < d.length; i += 4)d[i] = d[i] > 80 ? 255 : 0;
            tc.putImageData(img, 0, 0);
            const cc = document.createElement('canvas');
            cc.width = w; cc.height = h;
            cc.getContext('2d').drawImage(this._tmpC, 0, 0);
            e = { c: cc, w, h, bx, by };
            this._tc[key] = e;
        }
        let dx = Math.round(x) - e.bx;
        const dy = Math.round(y) - e.by;
        if (align === 'center') dx = Math.round(x) - Math.round(e.w / 2);
        else if (align === 'right') dx = Math.round(x) - e.w + e.bx;
        ctx.drawImage(e.c, dx, dy);
    },

    // ===== PETALS =====
    initPetals() {
        for (let i = 0; i < 30; i++) this.petals.push({
            x: Math.random() * this.W, y: Math.random() * this.H,
            vx: -0.2 - Math.random() * 0.15, vy: 0.25 + Math.random() * 0.3,
            s: 1.5 + Math.random(), a: 0.3 + Math.random() * 0.45, r: Math.random() * 6.28, dr: 0.5 + Math.random()
        });
    },
    updatePetals(dt) {
        for (const p of this.petals) {
            p.x += p.vx; p.y += p.vy; p.r += p.dr * dt;
            p.x += Math.sin(this.time * 2 + p.r) * 0.1;
            if (p.y > this.H + 5) { p.y = -5; p.x = Math.random() * this.W; }
            if (p.x < -5) p.x = this.W + 5;
        }
    },
    renderPetals(ctx) {
        for (const p of this.petals) {
            ctx.save(); ctx.translate(Math.round(p.x), Math.round(p.y)); ctx.rotate(p.r);
            ctx.globalAlpha = p.a;
            ctx.fillStyle = '#FFD0D8'; ctx.fillRect(-1, -1, 3, 2);
            ctx.fillStyle = '#FFC0C8'; ctx.fillRect(0, 0, 1, 1);
            ctx.restore();
        }
        ctx.globalAlpha = 1;
    },

    // ===== REACTIONS =====
    addReaction(x, y, type) {
        this.reactions.push({ x: x * TILE + 8, y: y * TILE - 4, vy: -0.4, life: 1.5, type });
    },
    updateReactions(dt) {
        for (let i = this.reactions.length - 1; i >= 0; i--) {
            const r = this.reactions[i]; r.y += r.vy; r.life -= dt;
            if (r.life <= 0) this.reactions.splice(i, 1);
        }
    },
    renderReactions(ctx) {
        for (const r of this.reactions) {
            const sx = Math.round(r.x - this.camX), sy = Math.round(r.y - this.camY);
            ctx.globalAlpha = Math.min(1, r.life * 2);
            this.drawText(ctx, r.type === 'heart' ? '<3' : '*', sx, sy, '#FF6088', 8, 'center');
        }
        ctx.globalAlpha = 1;
    },

    // ===== MAIN LOOP =====
    loop() {
        const now = performance.now(), dt = Math.min((now - this.lastTime) / 1000, 0.05);
        this.lastTime = now; this.time += dt;
        this.update(dt); this.render();
        requestAnimationFrame(() => this.loop());
    },

    update(dt) {
        if (this.state.startsWith('intro')) { this.updateIntro(dt); return; }
        if (this.state === 'transition') { this.updateTransition(dt); return; }
        if (this.state === 'questlog' || this.state === 'worldmap') return; // pause game
        if (this.state !== 'dialogue') {
            Player.update(dt);
            Vehicles.update(dt);
            // Check location-based quest objectives after player moves
            if (!Player.moving && !Vehicles.riding) Quests.checkLocation(Maps.current, Player.x, Player.y);
        }
        Dialogue.update(dt);
        Quests.update(dt);
        this.updateCamera(dt); this.updatePetals(dt); this.updateReactions(dt);
        if (this.toastTimer > 0) this.toastTimer -= dt;
        NPC.updateIdle(dt);
        NPC.updateAnimals(dt);
    },

    // ===== CAMERA =====
    updateCamera(dt) {
        const map = Maps.data[Maps.current]; if (!map) return;
        const tx = Player.px - this.W / 2 + TILE / 2, ty = Player.py - this.H / 2 + TILE / 2;
        const mx = Math.max(0, Math.min(map.width * TILE - this.W, tx));
        const my = Math.max(0, Math.min(map.height * TILE - this.H, ty));
        const lerp = 1 - Math.pow(0.0015, dt);
        this.camX += (mx - this.camX) * lerp; this.camY += (my - this.camY) * lerp;
    },

    // ===== RENDER =====
    render() {
        if (this.state === 'pc') { PC.render(this.ctx); return; }
        if (this.state.startsWith('intro')) { this.renderIntro(this.ctx); return; }
        this.renderGame(this.ctx);
    },

    renderGame(ctx) {
        const map = Maps.data[Maps.current]; if (!map) return;
        ctx.clearRect(0, 0, this.W, this.H);
        ctx.imageSmoothingEnabled = false;
        const camX = Math.round(this.camX), camY = Math.round(this.camY);

        const sx = Math.max(0, Math.floor(camX / TILE));
        const sy = Math.max(0, Math.floor(camY / TILE));
        const ex = Math.min(map.width, sx + Math.ceil(this.W / TILE) + 2);
        const ey = Math.min(map.height, sy + Math.ceil(this.H / TILE) + 2);
        const wf = Math.floor(this.time * 1.5) % 2;

        // 1. Ground
        for (let y = sy; y < ey; y++)for (let x = sx; x < ex; x++) {
            const g = Maps.getGround(Maps.current, x, y);
            let tn = Maps.tileKey[g] || 'grass';
            if (tn === 'grass') { const v = ((x * 7 + y * 13 + x * y) % 3); tn = ['grass', 'grass2', 'grass3'][v]; }
            if (tn === 'water' && wf === 1) tn = 'water2';
            const t = Sprites.tiles[tn]; if (t) ctx.drawImage(t, x * TILE - camX, y * TILE - camY);
        }

        // 2. Objects (not trees/sakura)
        for (let y = sy; y < ey; y++)for (let x = sx; x < ex; x++) {
            const o = Maps.getObject(Maps.current, x, y);
            if (o === '.' || o === 'T' || o === 'C') continue;
            const tn = Maps.tileKey[o]; if (tn && Sprites.tiles[tn])
                ctx.drawImage(Sprites.tiles[tn], x * TILE - camX, y * TILE - camY);
        }

        // 2b. Tree/sakura trunks
        for (let y = sy; y < ey; y++)for (let x = sx; x < ex; x++) {
            const o = Maps.getObject(Maps.current, x, y);
            if (o === 'T') ctx.drawImage(Sprites.tiles.tree, x * TILE - camX, y * TILE - camY);
            if (o === 'C') ctx.drawImage(Sprites.tiles.sakura, x * TILE - camX, y * TILE - camY);
        }

        // 2c. Animals
        NPC.renderAnimals(ctx, camX, camY, Maps.current);

        // 3. Characters (Y-sorted)
        const rb = []; 
        // Filter out hidden NPCs (e.g. Vedi when riding)
        const ne = NPC.render(ctx, camX, camY, Maps.current).filter(n => !n.hidden);
        rb.push(...ne);
        // Vedi companion (during shared quests) -- check if overriding map npc
        const vediComp = Quests.renderVediCompanion(ctx, camX, camY);
        if (vediComp && !Vehicles.riding) rb.push(vediComp);

        // Vehicle in Y-sort
        rb.push({
            y: Vehicles.riding ? Vehicles.y + 0.1 : Player.y + 100, // logic to sort vehicle
            render: () => Vehicles.render(ctx, camX, camY)
        });

        rb.push({
            y: Player.y + (Player.moving && Player.dir === 'down' ? 0.5 : 0), render: () => {
                Player.render(ctx, camX, camY);
                // Name above player (only when not sitting/sleeping/driving)
                // Name above player (only when not sitting/sleeping/driving/intro)
                if (this.state !== 'sitting' && this.state !== 'driving' && !this.state.startsWith('intro')) {
                    const px = Math.round(Player.px - camX) + 8;
                    const py = Math.round(Player.py - camY) - 8 + Math.round(Math.sin(this.time * 2.5) * 1);
                    this.drawText(ctx, 'Shogo', px, py, '#FFE8F0', 8, 'center');
                }
            }
        });
        rb.sort((a, b) => a.y - b.y); rb.forEach(r => r.render());

        // 4. Tree/sakura crowns
        for (let y = sy; y < ey; y++)for (let x = sx; x < ex; x++) {
            const o = Maps.getObject(Maps.current, x, y);
            if (o === 'T') ctx.drawImage(Sprites.tiles.treeCrown, x * TILE - camX, (y - 1) * TILE - camY);
            if (o === 'C') ctx.drawImage(Sprites.tiles.sakuraCrown, x * TILE - camX, (y - 1) * TILE - camY);
        }

        // 5. Reactions
        this.renderReactions(ctx);

        // 6. Petals
        if (Maps.current === 'overworld') this.renderPetals(ctx);

        // 7. HUD
        this.renderHUD(ctx);

        // 7b. Quest tracker
        Quests.renderTracker(ctx, this.W);

        // 8. Minimap
        if (this.showMinimap && Maps.current === 'overworld') this.renderMinimap(ctx);

        // 9. Dialogue
        Dialogue.render(ctx, this.W, this.H);

        // 9b. Quest log overlay
        Quests.renderLog(ctx, this.W, this.H);

        // 9c. World Map overlay
        if (this.state === 'worldmap') this.renderWorldMap(ctx);

        // 10. Toast
        if (this.toastTimer > 0) {
            const a = Math.min(1, this.toastTimer * 2); ctx.globalAlpha = a;
            ctx.fillStyle = 'rgba(20,15,30,0.9)'; ctx.fillRect(this.W / 2 - 120, 20, 240, 22);
            ctx.strokeStyle = '#C9B1FF'; ctx.lineWidth = 1; ctx.strokeRect(this.W / 2 - 120, 20, 240, 22);
            this.drawText(ctx, this.toastText, this.W / 2, 36, '#FFD070', 8, 'center');
            ctx.globalAlpha = 1;
        }

        // 11. Transition
        if (this.transitionAlpha > 0) {
            ctx.fillStyle = `rgba(0,0,0,${this.transitionAlpha})`; ctx.fillRect(0, 0, this.W, this.H);
        }

        // 12. Sitting overlay text
        if (this.state === 'sitting') {
            ctx.globalAlpha = 0.6 + Math.sin(this.time * 2) * 0.1;
            this.drawText(ctx, 'Press E to stand up', this.W / 2, this.H - 16, '#d8c0e8', 8, 'center');
            ctx.globalAlpha = 1;
        }
    },

    renderHUD(ctx) {
        if (this.state === 'intro_black') return;
        const bx = 6, by = 6, bw = 120, bh = 8;
        ctx.fillStyle = 'rgba(20,15,30,0.75)'; ctx.fillRect(bx - 2, by - 2, bw + 4, bh + 22);
        ctx.strokeStyle = '#C9B1FF'; ctx.lineWidth = 1; ctx.strokeRect(bx - 2, by - 2, bw + 4, bh + 22);
        this.drawText(ctx, 'VIBE', bx + 2, by + 8, '#C9B1FF', 8, 'left');
        ctx.fillStyle = '#2D2B3D'; ctx.fillRect(bx + 44, by + 4, bw - 44, bh - 2);
        const fill = (Player.vibeEnergy / Player.maxVibe) * (bw - 44);
        const grd = ctx.createLinearGradient(bx + 44, 0, bx + 44 + fill, 0);
        grd.addColorStop(0, '#FFD0D8'); grd.addColorStop(0.5, '#C9B1FF'); grd.addColorStop(1, '#B8E8C8');
        ctx.fillStyle = grd; ctx.fillRect(bx + 44, by + 4, fill, bh - 2);
        this.drawText(ctx, `${Player.vibeEnergy}`, bx + 2, by + bh + 14, '#FFE8F0', 8, 'left');

        const zn = {
            overworld: 'Comfort Town', comfort_house: 'Comfort House', creator_studio: 'Creator Studio',
            voice_booth: 'Voice Booth', team_arena: 'Team Arena', shogo_bedroom: "Shogo's Room", vedi_house: "Vedi's House"
        };
        this.drawText(ctx, zn[Maps.current] || '', this.W - 8, 14, '#FFE8F0', 8, 'right');


        // Interaction indicator
        // Relax strict movement check for driving so prompt appears more reliably
        const movingCheck = (this.state === 'driving') ? true : !Player.moving;
        
        if ((this.state === 'playing' || this.state === 'swimming' || this.state === 'driving') && movingCheck) {
            const v = Vehicles.checkNearby();
            const ft = Player.getFacingTile();
            
            // Check entities at facing tile
            const hasNPC = Maps.getNPC(Maps.current, ft.x, ft.y);
            // Also check current tile for NPC (overlapping)
            const overlapNPC = Maps.getNPC(Maps.current, Player.x, Player.y); 
            const targetNPC = hasNPC || overlapNPC;
            
            const hasSign = Maps.getSign(Maps.current, ft.x, ft.y);
            const hasInteract = Maps.getInteractable(Maps.current, ft.x, ft.y);
            const hasAnimal = Maps.getAnimal(Maps.current, ft.x, ft.y);

            if (v || targetNPC || hasSign || hasInteract || hasAnimal) {
                const cx = Math.round(this.camX), cy = Math.round(this.camY);
                // Use vehicle position if riding/parked involving vehicle
                const tx = v ? v.x : ft.x, ty = v ? v.y : ft.y;
                
                // If targeting an NPC, use their position specifically for the prompt
                const px = targetNPC ? targetNPC.x : tx;
                const py = targetNPC ? targetNPC.y : ty;
                
                const ix = Math.round(px * TILE - cx) + 8;
                const iy = Math.round(py * TILE - cy) - 8 + Math.round(Math.sin(this.time * 4) * 3);
                
                this.drawText(ctx, '!', ix, iy, '#FFD070', 8, 'center');
                ctx.fillStyle = 'rgba(20,15,30,0.85)'; ctx.fillRect(this.W / 2 - 55, this.H - 22, 110, 18);
                ctx.strokeStyle = '#FFD070'; ctx.lineWidth = 1; ctx.strokeRect(this.W / 2 - 55, this.H - 22, 110, 18);

                let label = '[E] Look';
                if (v) label = `[E] Ride ${v.type.charAt(0).toUpperCase() + v.type.slice(1)}`;
                else if (hasAnimal) label = '[E] Pet';
                
                // --- CUSTOM NPC LABEL LOGIC ---
                else if (targetNPC) {
                    label = `[E] Talk`;
                    // If the NPC is Vedi and we're driving, show prompt to pick up!
                    if (this.state === 'driving' && targetNPC.id === 'vedi') {
                        label = `[L] Ride w/ Vedi`;
                    }
                }
                
                this.drawText(ctx, label, this.W / 2, this.H - 8, '#FFD070', 8, 'center');
            } 
            
            // Check for Vedi pickup while driving (independent of facing direction)
            if (this.state === 'driving') {
                 // Always check for Vedi when driving
                 const map = Maps.data[Maps.current];
                 // Find vedi by ID or Sprite name (since ID might vary like 'vedi_home')
                 const vedi = (map?.npcs?.find(n => n.id.includes('vedi') || n.sprite === 'vedi')) || 
                              (Quests.companionNPC && Quests.companionNPC.id.includes('vedi') ? Quests.companionNPC : null);
                 
                 // Don't show if we already have the passenger
                 if(!Vehicles.vediPassenger && vedi && Math.abs(vedi.x - Player.x) <= 5 && Math.abs(vedi.y - Player.y) <= 5) {
                     // Draw indicator on Vedi
                     const cx = Math.round(this.camX), cy = Math.round(this.camY);
                     const ix = Math.round(vedi.x * TILE - cx) + 8;
                     const iy = Math.round(vedi.y * TILE - cy) - 16 + Math.round(Math.sin(this.time * 4) * 3);
                     
                     this.drawText(ctx, '!', ix, iy, '#FFD070', 8, 'center');
                     
                     // Draw prompt at bottom center - ensure we clear previous prompt area first
                     // This runs after the main interaction check, so we might overwrite the [E] Talk prompt if it exists, which is fine
                     ctx.fillStyle = 'rgba(20,15,30,0.85)'; ctx.fillRect(this.W / 2 - 60, this.H - 22, 120, 18);
                     ctx.strokeStyle = '#FFD070'; ctx.lineWidth = 1; ctx.strokeRect(this.W / 2 - 60, this.H - 22, 120, 18);
                     this.drawText(ctx, `[L] Pick up Vedi`, this.W / 2, this.H - 8, '#FFD070', 8, 'center');
                 }
            }
        }

        // Draw permanent HUD controls at the bottom right
        // this.drawText(ctx, '[Q] Quests  [L] Passenger  [M] Map', this.W - 8, this.H - 6, 'rgba(200,200,220,0.5)', 8, 'right');
        // Only show relevant controls
        let hudText = '[Q] Quests  [M] Map';
        if (Vehicles.vediPassenger) hudText += '  [L] Drop Vedi';
        this.drawText(ctx, hudText, this.W - 8, this.H - 6, 'rgba(200,200,220,0.5)', 8, 'right');
    },

    renderMinimap(ctx) {
        const map = Maps.data[Maps.current];
        const mmW = 100, mmH = Math.round(map.height * 100 / map.width);
        const mmX = this.W - mmW - 6, mmY = 22;
        const sc = mmW / map.width;

        ctx.fillStyle = 'rgba(20,15,30,0.85)'; ctx.fillRect(mmX - 3, mmY - 3, mmW + 6, mmH + 6);
        ctx.strokeStyle = '#C9B1FF'; ctx.lineWidth = 1; ctx.strokeRect(mmX - 3, mmY - 3, mmW + 6, mmH + 6);

        for (let y = 0; y < map.height; y++)for (let x = 0; x < map.width; x++) {
            const g = map.ground[y]?.[x] || 'G', o = Maps.getObject(Maps.current, x, y);
            let cl = '#5a8a3e';
            if (g === 'P') cl = '#d4c09a'; if (g === 'W') cl = '#6ab4d8'; if (g === 'F') cl = '#FFB0C0'; if (g === 'D') cl = '#4a7a32';
            if (o === 'T') cl = '#3a7830'; if (o === 'C') cl = '#e8a0b0'; if (o === 'h') cl = '#4a8838';
            if (o === 'S' || o === 'K') cl = '#96887a'; if (o === 'R') cl = '#c86060'; if (o === 'B') cl = '#6088b8';
            if (o === 'V' || o === 'Q') cl = '#d4a870';
            if (o === 'd') cl = '#8a6848';
            ctx.fillStyle = cl; ctx.fillRect(mmX + x * sc, mmY + y * sc, Math.ceil(sc), Math.ceil(sc));
        }
        ctx.fillStyle = '#FFD070'; ctx.fillRect(mmX + Player.x * sc - 1, mmY + Player.y * sc - 1, 4, 4);
        ctx.fillStyle = '#FF90A8';
        (map.npcs || []).forEach(n => ctx.fillRect(mmX + n.x * sc, mmY + n.y * sc, 3, 3));
        // Animals on minimap
        ctx.fillStyle = '#FFD0A0';
        (map.animals || []).forEach(a => ctx.fillRect(mmX + a.x * sc, mmY + a.y * sc, 2, 2));
    },

    // ===== TRANSITIONS =====
    transitionTo(target, sx, sy, type = 'door') {
        this.state = 'transition'; this.transitionTarget = target;
        this.transitionSpawn = { x: sx, y: sy };
        this.transitionAlpha = 0; this.transitionPhase = 'out';
        this.transitionType = type;
        if (type === 'door') AudioManager.playClick();
    },
    updateTransition(dt) {
        const speed = this.transitionType === 'stairs' ? 6 : 3;
        if (this.transitionPhase === 'out') {
            this.transitionAlpha += dt * speed;
            if (this.transitionAlpha >= 1) {
                this.transitionAlpha = 1; Maps.current = this.transitionTarget;
                Player.init(this.transitionSpawn.x, this.transitionSpawn.y);
                this.updateCamera(1); this.transitionPhase = 'in';
            }
        } else {
            this.transitionAlpha -= dt * speed;
            if (this.transitionAlpha <= 0) {
                this.transitionAlpha = 0;
                const g = Maps.getGround(Maps.current, Player.x, Player.y);
                if (Vehicles.riding) this.state = 'driving';
                else this.state = g === 'W' ? 'swimming' : 'playing';
                if (!AudioManager.bgmPlaying) AudioManager.startBGM();
                // If Vedi was a passenger, spawn her hidden in the new map so she stays with us
                if (Vehicles.vediPassenger) {
                    const newMap = Maps.data[Maps.current];
                    if (newMap && !(newMap.npcs || []).find(n => n.id === 'vedi_passenger')) {
                        if (!newMap.npcs) newMap.npcs = [];
                        newMap.npcs.push({ id: 'vedi_passenger', sprite: 'vedi', x: Player.x, y: Player.y, dir: 'down', dialogue: 'vedi_highway_talk', name: 'Vedi', hidden: true });
                    }
                }
            }
        }
    },

    showToast(text) { this.toastText = text; this.toastTimer = 2.5; },

    triggerSupportAnchor() {
        AudioManager.softenBGM(); AudioManager.playAnchor();
        const lines = ["Hey. I noticed you've been helping everyone.", "But who's checking on you?",
            "You're not alone. I've got you.", "Take a breath. You're doing amazing."];
        let i = 0; const next = () => {
            if (i < lines.length) {
                Dialogue.show(lines[i], null, 'Shogo', () => {
                    i++;
                    if (i < lines.length) next();
                    else { Player.vibeEnergy = Player.maxVibe; this.showToast('Vibe Energy fully restored!'); AudioManager.restoreBGM(); }
                });
            }
        }; next();
    },

    mapSelection: 0,
    mapLocations: [
        { id: 'mridula_bhawan', name: 'Mridula Bhawan (Home)', x: 12, y: 11 },
        { id: 'overworld', name: 'Comfort Town', x: 7, y: 25 },
        { id: 'mhow_highway', name: 'Mhow Highway', x: 5, y: 5 },
    ],

    toggleWorldMap() {
        if (this.state === 'worldmap') {
            this.state = 'playing';
        } else if (this.state === 'playing' || this.state === 'swimming') {
            this.state = 'worldmap';
            this.mapSelection = this.mapLocations.findIndex(l => l.id === Maps.current);
            if (this.mapSelection < 0) this.mapSelection = 0;
        }
    },

    renderWorldMap(ctx) {
        // Darken background
        ctx.fillStyle = 'rgba(0,0,0,0.8)'; ctx.fillRect(0, 0, this.W, this.H);

        this.drawText(ctx, 'WORLD MAP', this.W / 2, 40, '#FFD070', 16, 'center');
        ctx.strokeStyle = '#C9B1FF'; ctx.lineWidth = 2; ctx.strokeRect(50, 60, this.W - 100, this.H - 120);

        this.mapLocations.forEach((loc, i) => {
            const isSelected = i === this.mapSelection;
            const isCurrent = loc.id === Maps.current;
            const y = 80 + i * 30;

            if (isSelected) {
                ctx.fillStyle = 'rgba(201, 177, 255, 0.2)';
                ctx.fillRect(60, y - 10, this.W - 120, 25);
                this.drawText(ctx, '▶', 70, y + 8, '#FFD070', 10, 'left');
            }

            let color = isSelected ? '#fff' : '#aaa';
            if (isCurrent) color = '#7aac58';
            this.drawText(ctx, loc.name + (isCurrent ? ' (You are here)' : ''), 90, y + 8, color, 10, 'left');
        });

        this.drawText(ctx, '[W/S] Select  [Enter] Travel  [M/Esc] Close', this.W / 2, this.H - 40, '#888', 8, 'center');
    },

    travelToSelected() {
        const loc = this.mapLocations[this.mapSelection];
        if (loc.id === Maps.current) {
            this.toggleWorldMap();
            return;
        }
        this.transitionTo(loc.id, loc.x, loc.y);
        this.toggleWorldMap();
    }
};
