// ===== QUEST SYSTEM =====
const Quests = {
    data: null,          // quest definitions from quests.json
    active: [],          // array of { id, currentStep }
    completed: [],       // array of completed quest ids
    logOpen: false,      // quest log overlay state

    // Vedi companion state
    vediFollowing: false,
    vediX: 0, vediY: 0,
    vediDir: 'down',

    // === INIT ===
    async load() {
        try {
            const r = await fetch('data/quests.json');
            this.data = await r.json();
        } catch (e) {
            console.warn('Could not load quests.json');
            this.data = {};
        }
    },

    // === QUEST AVAILABILITY ===
    getAvailable(npcId) {
        if (!this.data) return [];
        return Object.entries(this.data)
            .filter(([id, q]) =>
                q.giver === npcId &&
                !this.completed.includes(id) &&
                !this.active.some(a => a.id === id) &&
                this.prereqMet(q.prereq)
            )
            .map(([id, q]) => ({ id, ...q }));
    },

    prereqMet(prereq) {
        if (!prereq) return true;
        return this.completed.includes(prereq);
    },

    isActive(questId) {
        return this.active.some(a => a.id === questId);
    },

    isCompleted(questId) {
        return this.completed.includes(questId);
    },

    getActive() {
        return this.active.map(a => ({
            ...a,
            quest: this.data[a.id],
            step: this.data[a.id]?.steps[a.currentStep]
        }));
    },

    // Is any shared (Vedi) quest active?
    isSharedActive() {
        return this.active.some(a => this.data[a.id]?.type === 'shared');
    },

    getActiveShared() {
        const a = this.active.find(a => this.data[a.id]?.type === 'shared');
        if (!a) return null;
        return { ...a, quest: this.data[a.id], step: this.data[a.id]?.steps[a.currentStep] };
    },

    // === ACCEPT QUEST ===
    accept(questId) {
        if (this.isActive(questId) || this.isCompleted(questId)) return false;
        const quest = this.data[questId];
        if (!quest) return false;

        this.active.push({ id: questId, currentStep: 0 });

        // If shared quest, start Vedi following
        if (quest.type === 'shared') {
            this.startVediFollow();
        }

        Engine.showToast(`Quest started: ${quest.title}`);
        AudioManager.playVibeUp();
        return true;
    },

    // === ADVANCE STEP ===
    advanceStep(questId) {
        const entry = this.active.find(a => a.id === questId);
        if (!entry) return;
        const quest = this.data[questId];
        if (!entry || !quest) return;

        entry.currentStep++;

        // Check if quest is complete
        if (entry.currentStep >= quest.steps.length) {
            this.complete(questId);
            return;
        }

        // Show hint for next step
        const nextStep = quest.steps[entry.currentStep];
        if (nextStep) {
            Engine.showToast(nextStep.hint);
        }
    },

    // === COMPLETE QUEST ===
    complete(questId) {
        const quest = this.data[questId];
        if (!quest) return;

        // Remove from active
        this.active = this.active.filter(a => a.id !== questId);
        this.completed.push(questId);

        // Grant reward
        if (quest.reward?.vibe) {
            Player.addVibe(quest.reward.vibe);
        }

        // Stop Vedi following if shared
        if (quest.type === 'shared') {
            this.stopVediFollow();
        }

        // Show completion dialogue
        Dialogue.show(quest.completion, null, quest.giver.charAt(0).toUpperCase() + quest.giver.slice(1), () => {
            Engine.showToast(`Quest complete! Vibe +${quest.reward?.vibe || 0}`);
            Engine.addReaction(Player.x, Player.y, 'heart');
            AudioManager.playVibeUp();
        });
    },

    // === CHECK OBJECTIVES ===
    // Called from player movement / NPC talk
    checkLocation(mapId, x, y) {
        for (const entry of this.active) {
            const quest = this.data[entry.id];
            if (!quest) continue;
            const step = quest.steps[entry.currentStep];
            if (!step) continue;

            if (step.type === 'visit') {
                const r = step.radius || 1;
                if (step.map === mapId && Math.abs(x - step.x) <= r && Math.abs(y - step.y) <= r) {
                    
                     // Check conditions (like passenger)
                     if (step.condition === 'passenger_vedi' && !Vehicles.vediPassenger) return false;

                    // Location reached
                    if (step.dialogue) {
                        // Show dialogue then advance
                        const dlg = NPC.dialogueData?.[step.dialogue];
                        const speaker = quest.type === 'shared' ? 'Vedi' : '';
                        Dialogue.show(
                            dlg?.text || 'You found the spot!',
                            dlg?.choices?.map(c => c.label) || null,
                            speaker,
                            (idx) => {
                                if(dlg?.choices && dlg.choices[idx]?.response) {
                                    Dialogue.show(dlg.choices[idx].response, null, speaker, () => this.advanceStep(entry.id));
                                } else {
                                    this.advanceStep(entry.id);
                                }
                            }
                        );
                    } else {
                        Engine.showToast('Found it!');
                        this.advanceStep(entry.id);
                    }
                    return true;
                }
            }
// ...existing code...
        }
        return false;
    },
    
    // Check interaction (PC, Plant, etc)
    checkInteract(mapId, x, y) {
         for (const entry of this.active) {
            const quest = this.data[entry.id];
            if (!quest) continue;
            const step = quest.steps[entry.currentStep];
            if (!step) continue;

            if (step.type === 'interact') {
                if (step.map === mapId && step.x === x && step.y === y) {
                     Engine.showToast(step.hint + '... Done!');
                     this.advanceStep(entry.id);
                     return true;
                }
            }
         }
         return false;
    },

            if (step.type === 'visit_tile') {
                const ground = Maps.getGround(mapId, x, y);
                if (step.map === mapId && ground === step.tile) {
                    Engine.showToast('Found some!');
                    this.advanceStep(entry.id);
                    return true;
                }
            }
        }
        return false;
    },

    // Check if talking to this NPC advances a quest
    checkTalk(npcId) {
        for (const entry of this.active) {
            const quest = this.data[entry.id];
            if (!quest) continue;
            const step = quest.steps[entry.currentStep];
            if (!step) continue;

            if ((step.type === 'talk_to' || step.type === 'return_to') && step.target === npcId) {
                // Show quest dialogue then advance
                const dlg = NPC.dialogueData?.[step.dialogue];
                const speaker = npcId.charAt(0).toUpperCase() + npcId.slice(1);
                if (dlg) {
                    if (dlg.choices?.length > 0) {
                        Dialogue.show(dlg.text, dlg.choices.map(c => c.label), speaker, (idx) => {
                            const ch = dlg.choices[idx];
                            if (ch?.vibeGain) Player.addVibe(ch.vibeGain);
                            if (ch?.response) {
                                Dialogue.show(ch.response, null, speaker, () => this.advanceStep(entry.id));
                            } else {
                                this.advanceStep(entry.id);
                            }
                        });
                    } else {
                        Dialogue.show(dlg.text, null, speaker, () => this.advanceStep(entry.id));
                    }
                } else {
                    this.advanceStep(entry.id);
                }
                return true;
            }
        }
        return false;
    },

    // === VEDI COMPANION ===
    startVediFollow() {
        this.vediFollowing = true;
        // Position Vedi near player
        this.vediX = Player.x;
        this.vediY = Player.y + 1;
        this.vediDir = 'up';
    },

    stopVediFollow() {
        this.vediFollowing = false;
    },

    updateVediFollow(dt) {
        if (!this.vediFollowing) return;

        // Vedi follows player, staying 1-2 tiles behind
        const dx = Player.x - this.vediX;
        const dy = Player.y - this.vediY;
        const dist = Math.abs(dx) + Math.abs(dy);

        // Only move if more than 2 tiles away
        if (dist > 2) {
            if (Math.abs(dx) > Math.abs(dy)) {
                this.vediX += Math.sign(dx);
                this.vediDir = dx > 0 ? 'right' : 'left';
            } else {
                this.vediY += Math.sign(dy);
                this.vediDir = dy > 0 ? 'down' : 'up';
            }
        } else if (dist > 0) {
            // Face toward player
            if (Math.abs(dx) > Math.abs(dy)) {
                this.vediDir = dx > 0 ? 'right' : 'left';
            } else {
                this.vediDir = dy > 0 ? 'down' : 'up';
            }
        }
    },

    renderVediCompanion(ctx, camX, camY) {
        if (!this.vediFollowing) return null;

        const sx = this.vediX * TILE - Math.round(camX);
        const sy = this.vediY * TILE - Math.round(camY);
        const key = `vedi_${this.vediDir}`;
        const sprite = Sprites.chars[key];

        return {
            y: this.vediY,
            render: () => {
                if (sprite) ctx.drawImage(sprite, sx, sy);
                // Small quest icon above Vedi
                const bob = Math.round(Math.sin(Engine.time * 3) * 1);
                Engine.drawText(ctx, '!', sx + 8, sy - 6 + bob, '#FFD070', 8, 'center');
            }
        };
    },

    // === QUEST LOG OVERLAY ===
    toggleLog() {
        if (this.logOpen) {
            this.logOpen = false;
            if (Engine.state === 'questlog') Engine.state = 'playing';
        } else {
            this.logOpen = true;
            Engine.state = 'questlog';
        }
    },

    renderLog(ctx, W, H) {
        if (!this.logOpen) return;

        // Dark overlay
        ctx.fillStyle = 'rgba(10, 8, 20, 0.88)';
        ctx.fillRect(0, 0, W, H);

        // Title
        Engine.drawText(ctx, 'Quest Log', W / 2, 22, '#C9B1FF', 8, 'center');

        // Divider
        ctx.fillStyle = '#C9B1FF';
        ctx.fillRect(W / 2 - 60, 28, 120, 1);

        let y = 42;

        // Active quests
        if (this.active.length > 0) {
            Engine.drawText(ctx, 'Active', 20, y, '#FFD070', 8, 'left');
            y += 14;
            for (const entry of this.active) {
                const quest = this.data[entry.id];
                if (!quest) continue;
                const step = quest.steps[entry.currentStep];
                const isShared = quest.type === 'shared';

                // Quest title
                const prefix = isShared ? '[Shared] ' : '';
                Engine.drawText(ctx, prefix + quest.title, 28, y, '#FFE8F0', 8, 'left');
                y += 12;

                // Current step hint
                if (step) {
                    Engine.drawText(ctx, '  > ' + step.hint, 28, y, '#A099B0', 8, 'left');
                    y += 12;
                }

                y += 4;
            }
        } else {
            Engine.drawText(ctx, 'No active quests', 20, y, '#A099B0', 8, 'left');
            y += 14;
        }

        y += 8;

        // Completed quests
        if (this.completed.length > 0) {
            Engine.drawText(ctx, 'Completed', 20, y, '#B8E8C8', 8, 'left');
            y += 14;
            for (const id of this.completed) {
                const quest = this.data[id];
                if (!quest) continue;
                Engine.drawText(ctx, quest.title, 28, y, '#6A7060', 8, 'left');
                y += 12;
            }
        }

        // Close hint
        Engine.drawText(ctx, '[Q] Close', W / 2, H - 12, 'rgba(200,200,220,0.5)', 8, 'center');
    },

    // === HUD TRACKER ===
    renderTracker(ctx, W) {
        if (this.active.length === 0) return;

        const entry = this.active[0];
        const quest = this.data[entry.id];
        if (!quest) return;
        const step = quest.steps[entry.currentStep];
        if (!step) return;

        // Small tracker in top-right
        const isShared = quest.type === 'shared';
        const title = (isShared ? '* ' : '') + quest.title;

        // Background
        const tw = Math.max(title.length, step.hint.length) * 7 + 20;
        ctx.fillStyle = 'rgba(20,15,30,0.7)';
        ctx.fillRect(W - tw - 8, 24, tw + 4, 28);
        ctx.strokeStyle = isShared ? '#FFD070' : '#C9B1FF';
        ctx.lineWidth = 1;
        ctx.strokeRect(W - tw - 8, 24, tw + 4, 28);

        // Text
        Engine.drawText(ctx, title, W - 10, 36, isShared ? '#FFD070' : '#FFE8F0', 8, 'right');
        Engine.drawText(ctx, step.hint, W - 10, 48, '#A099B0', 8, 'right');
    },

    // === UPDATE ===
    update(dt) {
        this.updateVediFollow(dt);
    }
};
