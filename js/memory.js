// ===== MEMORY SYSTEM (NPC Flags) =====
const Memory = {
    flags: {},

    init() {
        // Load from localStorage if available? (Future polish)
        this.flags = {};
    },

    set(flag) {
        if (!this.flags[flag]) {
            this.flags[flag] = true;
            console.log(`[Memory] Flag set: ${flag}`);
        }
    },

    has(flag) {
        return !!this.flags[flag];
    },

    count(prefix) {
        return Object.keys(this.flags).filter(k => k.startsWith(prefix)).length;
    }
};
