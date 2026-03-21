// Simple Web Audio API sounds
const audioCtx = typeof window !== "undefined" ? new (window.AudioContext || (window as any).webkitAudioContext)() : null;

function playTone(freq: number, duration: number, type: OscillatorType = "sine", volume = 0.08) {
  if (!audioCtx) return;
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
  playTone(2200, 0.08, "sine", 0.04);
}

export function playSuccess() {
  playTone(800, 0.15, "sine", 0.05);
  setTimeout(() => playTone(1000, 0.12, "sine", 0.04), 160);
}

export function playPurr() {
  playTone(80, 0.6, "sine", 0.03);
  setTimeout(() => playTone(90, 0.5, "sine", 0.025), 200);
}

export function playStart() {
  playTone(440, 0.12, "sine", 0.04);
  setTimeout(() => playTone(660, 0.15, "sine", 0.04), 130);
}

export function playMeow() {
  // Soft ascending "mew" for follow-up questions
  playTone(600, 0.12, "sine", 0.04);
  setTimeout(() => playTone(900, 0.18, "sine", 0.035), 100);
  setTimeout(() => playTone(700, 0.15, "sine", 0.025), 250);
}
