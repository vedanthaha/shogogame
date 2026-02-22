const PC = {
    active: false,
    app: 'home', // home, messages
    selectedAppIndex: 0,
    apps: ['Messages', 'Notes', 'Browser'], // Simple app list
    messages: [
        { sender: 'Vedi', subject: 'Wake up!!', body: 'Shogo! Are you up yet? The weather is perfect. Meet me outside!', read: false },
        { sender: 'Mom', subject: 'Food in fridge', body: 'Left some curry for you. Don\'t forget to eat.', read: true },
        { sender: 'Spam', subject: 'Win a free car', body: 'Click here to win a brand new car!', read: true }
    ],
    selectedMessageIndex: 0,

    open() {
        this.active = true;
        this.app = 'home';
        this.selectedAppIndex = 0;
        Engine.state = 'pc';
        AudioManager.playClick();
    },

    close() {
        this.active = false;
        Engine.state = 'playing';
        AudioManager.playClick();
        
        // check quest progress if message read
        if (Quests.active.some(q => q.id === 'shogo_morning')) {
            // Trigger quest update if needed, but the quest step is "interact", 
            // maybe we update it here or let the interaction itself handle it but only AFTER checking PC?
            // actually the quest currently just says "interact", so opening it is enough.
            // But let's make it so reading the "Wake up!!" message triggers a toast.
        }
    },

    handleKey(key) {
        if (!this.active) return;

        if (key === 'Escape') {
            if (this.app === 'home') {
                this.close();
            } else {
                this.app = 'home'; // Go back to desktop
            }
            return;
        }

        if (this.app === 'home') {
            if (key === 'ArrowRight') this.selectedAppIndex = (this.selectedAppIndex + 1) % this.apps.length;
            if (key === 'ArrowLeft') this.selectedAppIndex = (this.selectedAppIndex - 1 + this.apps.length) % this.apps.length;
            if (key === 'Enter' || key === ' ') {
                this.openApp(this.apps[this.selectedAppIndex]);
            }
        } else if (this.app === 'Messages') {
            if (key === 'ArrowDown') this.selectedMessageIndex = (this.selectedMessageIndex + 1) % this.messages.length;
            if (key === 'ArrowUp') this.selectedMessageIndex = (this.selectedMessageIndex - 1 + this.messages.length) % this.messages.length;
            if (key === 'Enter' || key === ' ') {
                 // Read message
                 const msg = this.messages[this.selectedMessageIndex];
                 if (!msg.read) {
                     msg.read = true;
                     if (msg.sender === 'Vedi') {
                         Engine.showToast("Message read: Meet Vedi outside.");
                         // Manually advance quest if current step is checking PC
                         // Since we changed it to 'scripted', checkInteract won't catch it.
                         // But we can check here.
                         const q = Quests.active.find(a => a.id === 'shogo_morning');
                         if (q) {
                             const data = Quests.data[q.id];
                             const step = data.steps[q.currentStep];
                             // Check explicitly if this is the PC step
                             if (step.hint.includes('PC')) {
                                 Quests.advanceStep(q.id);
                             }
                         }
                     }
                 }
            }
        }
    },

    openApp(appName) {
        this.app = appName;
        if (appName === 'Messages') {
            this.selectedMessageIndex = 0;
        }
    },

    render(ctx) {
        // Draw PC Screen Background
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, Engine.W, Engine.H);

        // Draw bezel/monitor frame roughly
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 20;
        ctx.strokeRect(0, 0, Engine.W, Engine.H);

        if (this.app === 'home') {
            this.renderDesktop(ctx);
        } else if (this.app === 'Messages') {
            this.renderMessages(ctx);
        } else {
            this.renderPlaceholderApp(ctx);
        }
    },

    renderDesktop(ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText("ShogoOS v1.0", Engine.W / 2, 50);

        const iconSize = 60;
        const gap = 40;
        const startX = (Engine.W - (this.apps.length * (iconSize + gap) - gap)) / 2;
        const startY = Engine.H / 2 - 30;

        this.apps.forEach((app, index) => {
            const x = startX + index * (iconSize + gap);
            const y = startY;

            // Icon box
            ctx.fillStyle = (this.selectedAppIndex === index) ? '#e94560' : '#16213e';
            ctx.fillRect(x, y, iconSize, iconSize);
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, iconSize, iconSize);

            // Icon Text
            ctx.fillStyle = '#fff';
            ctx.font = '14px monospace';
            ctx.fillText(app[0], x + iconSize/2, y + iconSize/2 + 5);

            // Label
            ctx.fillStyle = (this.selectedAppIndex === index) ? '#e94560' : '#888';
            ctx.fillText(app, x + iconSize/2, y + iconSize + 20);
        });
        
        ctx.fillStyle = '#888';
        ctx.font = '12px monospace';
        ctx.fillText("[Arrows] Move  [Enter] Open  [Esc] Power Off", Engine.W/2, Engine.H - 40);
    },

    renderMessages(ctx) {
        // App Header
        ctx.fillStyle = '#16213e';
        ctx.fillRect(50, 50, Engine.W - 100, Engine.H - 100);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(50, 50, Engine.W - 100, Engine.H - 100);

        ctx.fillStyle = '#fff';
        ctx.font = '18px monospace';
        ctx.textAlign = 'left';
        ctx.fillText("Messages", 70, 80);
        
        const listX = 70;
        const listY = 110;
        const itemH = 30;

        // List
        this.messages.forEach((msg, i) => {
            const y = listY + i * itemH;
            ctx.fillStyle = (i === this.selectedMessageIndex) ? '#e94560' : (msg.read ? '#888' : '#fff');
            ctx.font = '14px monospace';
            const prefix = msg.read ? ' ' : '*';
            ctx.fillText(`${prefix} ${msg.sender}: ${msg.subject}`, listX, y);
        });

        // Separator
        ctx.beginPath();
        ctx.moveTo(70, 250);
        ctx.lineTo(Engine.W - 70, 250);
        ctx.strokeStyle = '#555';
        ctx.stroke();

        // Selected Message Body
        const selMsg = this.messages[this.selectedMessageIndex];
        ctx.fillStyle = '#fff';
        ctx.font = '14px monospace';
        ctx.fillText(`From: ${selMsg.sender}`, listX, 280);
        
        // Wrap text logic simple
        const words = selMsg.body.split(' ');
        let line = '';
        let ly = 310;
        for(let w of words) {
            const testLine = line + w + ' ';
            if (ctx.measureText(testLine).width > Engine.W - 140) {
                ctx.fillText(line, listX, ly);
                line = w + ' ';
                ly += 20;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, listX, ly);

        ctx.fillStyle = '#888';
        ctx.textAlign = 'center';
        ctx.fillText("[Esc] Back", Engine.W/2, Engine.H - 70);
    },

    renderPlaceholderApp(ctx) {
         ctx.fillStyle = '#ffff';
         ctx.font = '20px monospace';
         ctx.textAlign = 'center';
         ctx.fillText("App Under Construction", Engine.W / 2, Engine.H / 2);
         ctx.fillText("[Esc] Back", Engine.W/2, Engine.H - 100);
    }
};
