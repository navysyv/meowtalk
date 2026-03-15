// Simple Web Audio API sounds
const audioCtx = typeof window !== "undefined" ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

function playTone(freq: number, duration: number, type: OscillatorType = "sine", volume = 0.08) {
  if (!audioCtx) return;
  // Resume context if suspended (autoplay policy)
  if (audioCtx.state === "suspended") audioCtx.resume();

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(volume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

export function playClick() {
  playTone(2200, 0.08, "sine", 0.05);
}

export function playSuccess() {
  // Two-note "meow-mew"
  playTone(800, 0.15, "sine", 0.06);
  setTimeout(() => playTone(1000, 0.12, "sine", 0.05), 160);
}

export function playPurr() {
  // Low soft rumble
  playTone(80, 0.6, "sine", 0.04);
  setTimeout(() => playTone(90, 0.5, "sine", 0.03), 200);
}

export function playStart() {
  playTone(440, 0.12, "sine", 0.05);
  setTimeout(() => playTone(660, 0.15, "sine", 0.05), 130);
}
