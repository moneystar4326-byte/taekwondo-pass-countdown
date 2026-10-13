// Web Audio API Synthesizer for dramatic countdown, drumroll, and fanfare

class SoundEffectsController {
  private ctx: AudioContext | null = null;
  private drumrollTimer: number | null = null;
  private cheerTimer: number | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Dramatic countdown tick sound (3, 2, 1)
  playCountdownTick(count: number) {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Base pitch increases slightly as we reach 1
    const baseFreq = count === 1 ? 880 : count === 2 ? 660 : 520;

    // High beep
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.15);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);

    // Deep sub thump for cinematic tension
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(120, now);
    subOsc.frequency.exponentialRampToValueAtTime(40, now + 0.25);

    subGain.gain.setValueAtTime(0.5, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);

    subOsc.start(now);
    subOsc.stop(now + 0.4);
  }

  // Snare drum roll building tension
  startDrumRoll(durationSeconds: number = 3.5) {
    const ctx = this.getContext();
    if (!ctx) return;

    this.stopDrumRoll();

    const bufferSize = ctx.sampleRate * 0.05; // 50ms noise slice
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const startTime = ctx.currentTime;
    const intervalMs = 45;
    let elapsedMs = 0;

    const playStrike = () => {
      if (!this.ctx || this.ctx.currentTime - startTime >= durationSeconds) {
        this.stopDrumRoll();
        return;
      }

      const now = this.ctx.currentTime;
      const progress = Math.min(1, (now - startTime) / durationSeconds);

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1000 + progress * 1500;
      filter.Q.value = 2.0;

      const gain = this.ctx.createGain();
      // Increase volume as roll reaches climax
      const volume = 0.05 + progress * 0.22;
      gain.gain.setValueAtTime(volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.05);

      elapsedMs += intervalMs;
      this.drumrollTimer = window.setTimeout(playStrike, intervalMs);
    };

    playStrike();
  }

  stopDrumRoll() {
    if (this.drumrollTimer !== null) {
      window.clearTimeout(this.drumrollTimer);
      this.drumrollTimer = null;
    }
  }

  // Triumphant Victory / Fanfare melody for "합격!"
  playFanfare() {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Victory fanfare notes: C5, G4, C5, E5, G5 (extended sustain)
    const notes = [
      { freq: 523.25, start: 0.0, duration: 0.18, vol: 0.4 },  // C5
      { freq: 392.00, start: 0.18, duration: 0.16, vol: 0.35 }, // G4
      { freq: 523.25, start: 0.34, duration: 0.22, vol: 0.45 }, // C5
      { freq: 659.25, start: 0.56, duration: 0.26, vol: 0.5 },  // E5
      { freq: 783.99, start: 0.82, duration: 1.4, vol: 0.65 },  // G5 triumphant hold
      { freq: 1046.50, start: 0.82, duration: 1.4, vol: 0.35 }, // High C6 harmonic
    ];

    notes.forEach((note) => {
      const noteStart = now + note.start;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Brass-like overtone mix with saw/triangle
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note.freq, noteStart);

      // Lowpass filter for smooth trumpet/brass feel
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(note.freq * 3.5, noteStart);

      gain.gain.setValueAtTime(0.001, noteStart);
      gain.gain.linearRampToValueAtTime(note.vol, noteStart + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + note.duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + note.duration + 0.05);
    });

    // Also trigger synthesized cheering applause in the background
    this.playApplause();
  }

  // Synthesized cheering crowd applause
  playApplause() {
    const ctx = this.getContext();
    if (!ctx) return;

    if (this.cheerTimer !== null) {
      window.clearTimeout(this.cheerTimer);
    }

    const now = ctx.currentTime;
    const duration = 2.8;

    // Crowd noise buffer
    const bufferSize = ctx.sampleRate * duration;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(1.2, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
  }

  stopAll() {
    this.stopDrumRoll();
    if (this.cheerTimer !== null) {
      window.clearTimeout(this.cheerTimer);
      this.cheerTimer = null;
    }
  }
}

export const soundEffects = new SoundEffectsController();
