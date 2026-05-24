/**
 * Synthesizes high-fidelity, satisfying micro-haptic sound effects using Web Audio API.
 * Requires no external audio files, works instantly, and consumes negligible resources.
 */
export const playHapticFeedback = (type: "light" | "medium" | "heavy" | "success" | "error" | "none" = "light") => {
  if (type === "none" || typeof window === "undefined") return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    
    // Resume context if suspended (common browser autoplay policy behavior)
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const playTick = (freqStart: number, freqEnd: number, duration: number, volume: number, oscType: OscillatorType = "sine") => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = oscType;
      osc.frequency.setValueAtTime(freqStart, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freqEnd, ctx.currentTime + duration);

      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + duration);
    };

    switch (type) {
      case "light":
        // A satisfying mechanical switch tick (light and snappy)
        playTick(1600, 800, 0.03, 0.012);
        break;
      case "medium":
        // A slightly deeper, solid tactile click
        playTick(1200, 400, 0.04, 0.015, "triangle");
        break;
      case "heavy":
        // A heavier, highly pronounced press
        playTick(900, 200, 0.06, 0.02, "triangle");
        break;
      case "success":
        // A beautiful two-tone success chirp
        playTick(880, 1200, 0.08, 0.01, "sine");
        setTimeout(() => {
          try {
            const ctx2 = new AudioContextClass();
            const osc2 = ctx2.createOscillator();
            const gain2 = ctx2.createGain();
            osc2.type = "sine";
            osc2.frequency.setValueAtTime(1200, ctx2.currentTime);
            osc2.frequency.exponentialRampToValueAtTime(1500, ctx2.currentTime + 0.06);
            gain2.gain.setValueAtTime(0.01, ctx2.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.0001, ctx2.currentTime + 0.06);
            osc2.connect(gain2);
            gain2.connect(ctx2.destination);
            osc2.start();
            osc2.stop(ctx2.currentTime + 0.06);
          } catch {}
        }, 60);
        break;
      case "error":
        // A low-pitched dual-tone error buzz
        playTick(220, 110, 0.15, 0.025, "sawtooth");
        break;
    }
  } catch (error) {
    // Fail silently to avoid interrupting UI interactions
  }
};
