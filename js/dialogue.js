// ===== PIXEL RPG DIALOGUE BOX =====
const Dialogue = {
    active: false,
    text: '',
    displayedText: '',
    charIndex: 0,
    typeSpeed: 0.03,    // seconds per character
    typeTimer: 0,
    choices: null,       // array of strings or null
    selectedChoice: 0,
    callback: null,
    speaker: '',
    done: false,         // text fully revealed

    show(text, choices, speaker, callback) {
        this.active = true;
        this.text = text;
        this.displayedText = '';
        this.charIndex = 0;
        this.typeTimer = 0;
        this.choices = choices;
        this.selectedChoice = 0;
        this.callback = callback || null;
        this.speaker = speaker || '';
        this.done = false;
        Engine.state = 'dialogue';
        AudioManager.playClick();
    },

    update(dt) {
        if (!this.active) return;

        // Typewriter effect
        if (!this.done) {
            this.typeTimer += dt;
            while (this.typeTimer >= this.typeSpeed && this.charIndex < this.text.length) {
                this.typeTimer -= this.typeSpeed;
                this.displayedText += this.text[this.charIndex];
                this.charIndex++;
            }
            if (this.charIndex >= this.text.length) {
                this.done = true;
            }
        }
    },

    handleKey(key) {
        if (!this.active) return;

        // Space/Enter/E to advance
        if (key === ' ' || key === 'Enter' || key === 'e' || key === 'E') {
            if (!this.done) {
                // Skip typewriter, show all text
                this.displayedText = this.text;
                this.charIndex = this.text.length;
                this.done = true;
                return;
            }

            if (this.choices && this.choices.length > 0) {
                // Confirm choice
                this.active = false;
                Engine.state = 'playing';
                if (this.callback) this.callback(this.selectedChoice);
            } else {
                // Close dialogue
                this.active = false;
                Engine.state = 'playing';
                if (this.callback) this.callback();
            }
            return;
        }

        // Arrow keys for choice selection
        if (this.done && this.choices) {
            if (key === 'ArrowUp' || key === 'w' || key === 'W') {
                this.selectedChoice = Math.max(0, this.selectedChoice - 1);
                AudioManager.playClick();
            }
            if (key === 'ArrowDown' || key === 's' || key === 'S') {
                this.selectedChoice = Math.min(this.choices.length - 1, this.selectedChoice + 1);
                AudioManager.playClick();
            }
        }
    },

    render(ctx, W, H) {
        if (!this.active) return;

        const boxH = this.choices ? 100 : 64;
        const boxY = H - boxH - 6;
        const boxX = 6;
        const boxW = W - 12;

        // Dark box with border
        ctx.fillStyle = 'rgba(15, 12, 25, 0.92)';
        ctx.fillRect(boxX, boxY, boxW, boxH);
        ctx.strokeStyle = '#C9B1FF';
        ctx.lineWidth = 1;
        ctx.strokeRect(boxX + 0.5, boxY + 0.5, boxW - 1, boxH - 1);

        // Speaker name (bitmap text)
        if (this.speaker) {
            Engine.drawText(ctx, this.speaker, boxX + 8, boxY + 12, '#C9B1FF', 8, 'left');
        }

        // Dialogue text (word wrap, bitmap text)
        const maxChars = Math.floor((boxW - 20) / 7);
        const lines = this.wrapText(this.displayedText, maxChars);
        const textY = boxY + (this.speaker ? 24 : 14);
        lines.forEach((line, i) => {
            if (i < 3) Engine.drawText(ctx, line, boxX + 8, textY + i * 12, '#F0E6FF', 8, 'left');
        });

        // Blink indicator when done
        if (this.done && !this.choices) {
            if (Math.floor(Date.now() / 400) % 2 === 0) {
                Engine.drawText(ctx, 'v', boxX + boxW - 14, boxY + boxH - 6, '#C9B1FF', 8, 'left');
            }
        }

        // Choices
        if (this.done && this.choices) {
            const cy = textY + Math.min(lines.length, 3) * 12 + 6;
            this.choices.forEach((choice, i) => {
                const isSelected = i === this.selectedChoice;
                const label = (isSelected ? '> ' : '  ') + choice;
                Engine.drawText(ctx, label, boxX + 12, cy + i * 14, isSelected ? '#FFD700' : '#A099B0', 8, 'left');
            });
        }
    },

    wrapText(text, maxChars) {
        const result = [];
        const parts = text.split('\n');
        for (const part of parts) {
            const words = part.split(' ');
            let line = '';
            for (const word of words) {
                if ((line + ' ' + word).trim().length > maxChars) {
                    result.push(line.trim());
                    line = word;
                } else {
                    line = line ? line + ' ' + word : word;
                }
            }
            if (line.trim()) result.push(line.trim());
        }
        return result;
    }
};
