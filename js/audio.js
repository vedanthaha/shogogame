// ===== AUDIO MANAGER =====
// Synthesized sounds using Web Audio API - no external files needed

const AudioManager = {
  ctx: null,
  bgmGain: null,
  sfxGain: null,
  bgmPlaying: false,
  bgmInterval: null,
  muted: false,

  init() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.bgmGain = this.ctx.createGain();
    this.bgmGain.gain.value = 0.12;
    this.bgmGain.connect(this.ctx.destination);
    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.value = 0.2;
    this.sfxGain.connect(this.ctx.destination);
  },

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },

  // Soft click sound for UI interactions
  playClick() {
    if (!this.ctx || this.muted) return;
    this.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.08);
  },

  // Success / positive sound
  playSuccess() {
    if (!this.ctx || this.muted) return;
    this.resume();
    const notes = [523, 659, 784]; // C5, E5, G5
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.1 + 0.3);
      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(this.ctx.currentTime + i * 0.1);
      osc.stop(this.ctx.currentTime + i * 0.1 + 0.3);
    });
  },

  // Vibe gain sound
  playVibeUp() {
    if (!this.ctx || this.muted) return;
    this.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(800, this.ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.3);
  },

  // Rhythm hit sound
  playHit() {
    if (!this.ctx || this.muted) return;
    this.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 660;
    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.15);
  },

  // Rhythm miss sound
  playMiss() {
    if (!this.ctx || this.muted) return;
    this.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 200;
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start(this.ctx.currentTime);
    osc.stop(this.ctx.currentTime + 0.2);
  },

  // Warm support anchor sound
  playAnchor() {
    if (!this.ctx || this.muted) return;
    this.resume();
    const chords = [
      [261, 329, 392], // C major
      [293, 369, 440], // D major
      [261, 329, 392], // C major
    ];
    chords.forEach((chord, ci) => {
      chord.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const t = this.ctx.currentTime + ci * 0.8;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.06, t + 0.2);
        gain.gain.linearRampToValueAtTime(0.06, t + 0.6);
        gain.gain.linearRampToValueAtTime(0, t + 0.8);
        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(t);
        osc.stop(t + 0.85);
      });
    });
  },

  // Lofi BGM - gentle chord progression
  startBGM() {
    if (!this.ctx || this.bgmPlaying || this.muted) return;
    this.resume();
    this.bgmPlaying = true;
    // Lofi chords: Am7 - Dm7 - G7 - Cmaj7  
    const progression = [
      [220, 261, 330, 392],
      [293, 349, 440, 523],
      [196, 247, 293, 349],
      [261, 330, 392, 494],
    ];
    let chordIndex = 0;
    const playChord = () => {
      if (!this.bgmPlaying) return;
      const chord = progression[chordIndex % progression.length];
      chord.forEach(freq => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const t = this.ctx.currentTime;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(this.bgmGain.gain.value * 0.4, t + 0.5);
        gain.gain.linearRampToValueAtTime(this.bgmGain.gain.value * 0.4, t + 1.8);
        gain.gain.linearRampToValueAtTime(0, t + 2.5);
        osc.connect(gain);
        gain.connect(this.bgmGain);
        osc.start(t);
        osc.stop(t + 2.6);
      });
      chordIndex++;
    };
    playChord();
    this.bgmInterval = setInterval(playChord, 2500);
  },

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  },

  softenBGM() {
    if (this.bgmGain) {
      this.bgmGain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 1);
    }
  },

  restoreBGM() {
    if (this.bgmGain) {
      this.bgmGain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 1);
    }
  }
};
