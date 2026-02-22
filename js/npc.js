// ===== NPC + ANIMAL SYSTEM =====
const NPC = {
    dialogueData: null, idleTimers: {}, animalTimers: {},

    async loadDialogues() {
        try { const r = await fetch('data/dialogues.json'); this.dialogueData = await r.json(); }
        catch (e) { console.warn('Could not load dialogues.json'); this.dialogueData = {}; }
    },

    updateIdle(dt) {
        const map = Maps.data[Maps.current]; if (!map || !map.npcs) return;
        for (const npc of map.npcs) {
            if (!this.idleTimers[npc.id]) this.idleTimers[npc.id] = 2 + Math.random() * 4;
            this.idleTimers[npc.id] -= dt;
            if (this.idleTimers[npc.id] <= 0) {
                const dirs = ['down', 'left', 'right', 'down'];
                npc.dir = dirs[Math.floor(Math.random() * dirs.length)];
                this.idleTimers[npc.id] = 3 + Math.random() * 5;
            }
        }
    },

    // ===== ANIMAL UPDATE (simple wandering) =====
    updateAnimals(dt) {
        const map = Maps.data[Maps.current]; if (!map || !map.animals) return;
        for (const a of map.animals) {
            if (!this.animalTimers[a.id]) this.animalTimers[a.id] = { wander: 3 + Math.random() * 5, happy: 0 };
            const at = this.animalTimers[a.id];

            // Happy cooldown
            if (at.happy > 0) at.happy -= dt;

            // Wander (puppies move, cats/birds stay)
            if (a.type === 'puppy') {
                at.wander -= dt;
                if (at.wander <= 0) {
                    at.wander = 4 + Math.random() * 6;
                    // Try to move to adjacent empty tile near home
                    const dirs = [[0, -1], [0, 1], [-1, 0], [1, 0]];
                    const d = dirs[Math.floor(Math.random() * dirs.length)];
                    const nx = a.x + d[0], ny = a.y + d[1];
                    const dist = Math.abs(nx - a.homeX) + Math.abs(ny - a.homeY);
                    if (dist <= 3 && !Maps.isSolid(Maps.current, nx, ny) &&
                        !Maps.getNPC(Maps.current, nx, ny) &&
                        !(nx === Player.x && ny === Player.y)) {
                        // Check no other animal there
                        const blocked = map.animals.some(o => o !== a && o.x === nx && o.y === ny);
                        if (!blocked) { a.x = nx; a.y = ny; }
                    }
                }
            }
        }
    },

    // ===== PET ANIMAL =====
    petAnimal(animal) {
        const at = this.animalTimers[animal.id];
        if (!at) return;
        at.happy = 3; // Happy for 3 seconds
        Engine.addReaction(animal.x, animal.y, 'heart');
        AudioManager.playVibeUp();

        const texts = {
            puppy: [
                "The puppy wags its tail happily!",
                "Puppy wiggles with joy!",
                "The puppy licks your hand!",
                "The puppy rolls over for belly rubs!"
            ],
            cat: [
                "The cat purrs contentedly...",
                "The cat closes its eyes and leans in.",
                "A gentle purr vibrates your hand.",
                "The cat rubs against you."
            ],
            bird: [
                "The bird chirps a little tune!",
                "It tilts its head curiously.",
                "A happy little tweet!",
            ]
        };
        const pool = texts[animal.type] || ["It seems happy."];
        Engine.showToast(pool[Math.floor(Math.random() * pool.length)]);
        Player.addVibe(2);
    },

    // ===== NPC INTERACTION (with quest integration) =====
    interact(npc) {
        if (!this.dialogueData) return;
        const dx = Player.x - npc.x, dy = Player.y - npc.y;
        if (Math.abs(dx) > Math.abs(dy)) npc.dir = dx > 0 ? 'right' : 'left';
        else npc.dir = dy > 0 ? 'down' : 'up';

        // 1. Check if this NPC advances an active quest step
        if (Quests.data && Quests.checkTalk(npc.id)) return;

        // 2. Check for available quests from this NPC
        if (Quests.data) {
            const available = Quests.getAvailable(npc.id);
            if (available.length > 0) {
                const quest = available[0]; // offer first available quest
                const questDlg = this.dialogueData[quest.steps[0]?.dialogue];
                const questText = questDlg?.text || quest.description;
                Dialogue.show(questText, ['Accept quest', 'Maybe later'], npc.name, (idx) => {
                    if (idx === 0) {
                        Quests.accept(quest.id);
                        // If first step is talk_to this NPC, immediately advance
                        const firstStep = quest.steps[0];
                        if ((firstStep.type === 'talk_to') && firstStep.target === npc.id) {
                            Quests.advanceStep(quest.id);
                        }
                    } else {
                        Engine.showToast('Come back anytime!');
                    }
                });
                return;
            }
        }

        // 3. Memory-based dialogue (Special checks)
        if (npc.id === 'vedi') {
            if (Memory.has('visited_highway')) {
                Dialogue.show(this.dialogueData.vedi_highway_talk.text, null, npc.name); return;
            }
            if (Memory.has('drove_with_vedi')) {
                Dialogue.show(this.dialogueData.vedi_after_ride.text, null, npc.name); return;
            }
            if (Maps.current === 'mridula_bhawan') {
                Dialogue.show(this.dialogueData.vedi_residential.text, null, npc.name); return;
            }
        }

        // 4. Normal dialogue (existing behavior)
        const dlg = this.dialogueData[npc.dialogue];
        if (!dlg) { Dialogue.show('Nice to see you!', null, npc.name); return; }
        if (Player.helpedNPCs.has(npc.id) && dlg.helped) {
            Dialogue.show(dlg.helped, null, npc.name); return;
        }
        if (dlg.choices && dlg.choices.length > 0) {
            Dialogue.show(dlg.text, dlg.choices.map(c => c.label), npc.name, (idx) => {
                const ch = dlg.choices[idx]; if (!ch) return;
                Player.addVibe(ch.vibeGain || 10);
                Player.helpedNPCs.add(npc.id);
                AudioManager.playVibeUp();
                Engine.addReaction(npc.x, npc.y, 'heart');
                Dialogue.show(ch.response, null, npc.name, () => {
                    Engine.showToast('Vibe Energy +' + (ch.vibeGain || 10));
                    if (Player.helpedNPCs.size >= 3 && !Engine.anchorTriggered) {
                        Engine.anchorTriggered = true;
                        setTimeout(() => Engine.triggerSupportAnchor(), 1200);
                    }
                });
            });
        } else { Dialogue.show(dlg.text, null, npc.name); }
    },

    // ===== RENDER NPCs (16×16, at tile position) =====
    render(ctx, camX, camY, mapId) {
        const map = Maps.data[mapId]; if (!map || !map.npcs) return [];
        return map.npcs.map(npc => {
            const helped = Player.helpedNPCs.has(npc.id);
            return {
                y: npc.y, render: () => {
                    if (npc.id === 'vedi' && Vehicles.vediPassenger) return; // Hide Vedi if she's a passenger
                    const sx = npc.x * TILE - Math.round(camX);
                    const sy = npc.y * TILE - Math.round(camY);
                    const key = `${npc.sprite}_${npc.dir}`;
                    const sprite = Sprites.chars[key];
                    if (sprite) ctx.drawImage(sprite, sx, sy);
                    const bob = Math.round(Math.sin(Engine.time * 2 + npc.x) * 1);
                    Engine.drawText(ctx, npc.name, sx + 8, sy - 6 + bob, helped ? '#B8E8C8' : '#FFE8F0', 8, 'center');
                    if (helped) {
                        Engine.drawText(ctx, '<3', sx + 8, sy - 14 + bob, '#B8E8C8', 8, 'center');
                    }
                }
            };
        });
    },

    // ===== RENDER ANIMALS =====
    renderAnimals(ctx, camX, camY, mapId) {
        const map = Maps.data[mapId]; if (!map || !map.animals) return;
        for (const a of map.animals) {
            const sx = a.x * TILE - Math.round(camX), sy = a.y * TILE - Math.round(camY);
            const at = this.animalTimers[a.id] || { happy: 0 };
            const isHappy = at.happy > 0;

            let sprite = null;
            if (a.type === 'puppy') {
                sprite = isHappy ? Sprites.animals.puppy_happy : Sprites.animals.puppy_idle;
                // Gentle bounce when happy
                if (isHappy) {
                    const bounce = Math.round(Math.sin(Engine.time * 8) * 1);
                    ctx.drawImage(sprite, sx, sy + bounce);
                } else {
                    ctx.drawImage(sprite, sx, sy);
                }
            } else if (a.type === 'cat') {
                sprite = isHappy ? Sprites.animals.cat_happy : Sprites.animals.cat_idle;
                ctx.drawImage(sprite, sx, sy);
            } else if (a.type === 'bird') {
                sprite = Sprites.animals.bird;
                // Subtle perched sway
                const sway = Math.round(Math.sin(Engine.time * 3 + a.x) * 0.5);
                ctx.drawImage(sprite, sx + sway, sy);
            }
        }
    }
};
