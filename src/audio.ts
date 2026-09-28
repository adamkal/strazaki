import type { Sound } from './sounds'

export type Durations = { extinguishingMs: number; bigCelebrationMs: number }

const volume = 0.2
const sirenNoteSeconds = 0.4

function synth(context: AudioContext, output: AudioNode, durations: Durations): Record<Sound, (now: number) => void> {
  let noise: AudioBuffer | null = null

  function envelope(start: number, peak: number): GainNode {
    const gain = context.createGain()
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(peak, start + 0.01)
    gain.connect(output)
    return gain
  }

  function tone(frequency: number, start: number, seconds: number, type: OscillatorType = 'sine') {
    const oscillator = context.createOscillator()
    oscillator.type = type
    oscillator.frequency.value = frequency
    const gain = envelope(start, 1)
    gain.gain.exponentialRampToValueAtTime(0.001, start + seconds)
    oscillator.connect(gain)
    oscillator.start(start)
    oscillator.stop(start + seconds)
  }

  function hiss(start: number, seconds: number) {
    const source = context.createBufferSource()
    noise ??= whiteNoise(context, seconds)
    source.buffer = noise
    const filter = context.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 2000
    const gain = envelope(start, 0.5)
    gain.gain.setValueAtTime(0.5, start + seconds * 0.8)
    gain.gain.linearRampToValueAtTime(0, start + seconds)
    source.connect(filter).connect(gain)
    source.start(start)
    source.stop(start + seconds)
  }

  function siren(start: number, seconds: number) {
    const oscillator = context.createOscillator()
    oscillator.type = 'triangle'
    const notes = Math.floor(seconds / sirenNoteSeconds)
    for (let i = 0; i < notes; i++) {
      oscillator.frequency.setValueAtTime(i % 2 === 0 ? 880 : 660, start + i * sirenNoteSeconds)
    }
    const end = start + notes * sirenNoteSeconds
    const gain = envelope(start, 0.6)
    gain.gain.setValueAtTime(0.6, end - 0.1)
    gain.gain.linearRampToValueAtTime(0, end)
    oscillator.connect(gain)
    oscillator.start(start)
    oscillator.stop(end)
  }

  return {
    step: (now) => tone(520, now, 0.08, 'triangle'),
    hiss: (now) => hiss(now, durations.extinguishingMs / 1000),
    chime: (now) => [523, 659, 784, 1047].forEach((frequency, i) => tone(frequency, now + i * 0.12, 0.6)),
    siren: (now) => siren(now, durations.bigCelebrationMs / 1000),
  }
}

function whiteNoise(context: AudioContext, seconds: number): AudioBuffer {
  const buffer = context.createBuffer(1, Math.ceil(context.sampleRate * seconds), context.sampleRate)
  const samples = buffer.getChannelData(0)
  for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1
  return buffer
}

export function createAudio(durations: Durations, makeContext: () => AudioContext = () => new AudioContext()) {
  let context: AudioContext | null = null
  let sounds: Record<Sound, (now: number) => void> | null = null

  return {
    unlock() {
      try {
        if (!context) {
          context = makeContext()
          const output = context.createGain()
          output.gain.value = volume
          output.connect(context.destination)
          sounds = synth(context, output, durations)
        }
        if (context.state !== 'running') void context.resume().catch(() => {})
      } catch {
        // Sounds are optional: without Web Audio the game stays playable, just silent.
      }
    },
    play(sound: Sound) {
      if (context && sounds) sounds[sound](context.currentTime)
    },
  }
}
