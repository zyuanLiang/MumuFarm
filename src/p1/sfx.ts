/** Soft procedural SFX — no asset downloads, cozy not neon. */

type SfxKind = 'plant' | 'water' | 'harvest' | 'equip' | 'unlock' | 'photo' | 'tap';

let ctx: AudioContext | null = null;

function ac(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as {webkitAudioContext?: typeof AudioContext}).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  return ctx;
}

function tone(
  frequency: number,
  duration: number,
  type: OscillatorType,
  gain = 0.04,
  when = 0,
) {
  const audio = ac();
  if (!audio) return;
  const t0 = audio.currentTime + when;
  const osc = audio.createOscillator();
  const g = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g);
  g.connect(audio.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}

export function resumeAudio(): void {
  const audio = ac();
  if (audio?.state === 'suspended') void audio.resume();
}

export function playSfx(kind: SfxKind): void {
  resumeAudio();
  switch (kind) {
    case 'tap':
      tone(520, 0.06, 'triangle', 0.025);
      break;
    case 'plant':
      tone(380, 0.09, 'sine', 0.035);
      tone(520, 0.12, 'triangle', 0.03, 0.05);
      break;
    case 'water':
      tone(660, 0.05, 'sine', 0.02);
      tone(880, 0.08, 'sine', 0.018, 0.04);
      tone(990, 0.1, 'triangle', 0.015, 0.08);
      break;
    case 'harvest':
      tone(523, 0.1, 'triangle', 0.04);
      tone(659, 0.12, 'triangle', 0.035, 0.07);
      tone(784, 0.16, 'sine', 0.03, 0.14);
      break;
    case 'equip':
      tone(440, 0.1, 'sine', 0.03);
      tone(660, 0.14, 'triangle', 0.028, 0.08);
      break;
    case 'unlock':
      tone(523, 0.1, 'triangle', 0.035);
      tone(784, 0.14, 'triangle', 0.03, 0.09);
      tone(1046, 0.18, 'sine', 0.025, 0.18);
      break;
    case 'photo':
      tone(240, 0.04, 'square', 0.02);
      tone(180, 0.08, 'sine', 0.015, 0.03);
      break;
    default:
      break;
  }
}
