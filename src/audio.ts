import type { Sound } from './sounds'

export type Durations = { hissMs: number; sirenMs: number }

const volume = 0.2

export function createAudio(
  makeContext: () => AudioContext = () => new AudioContext(),
  durations: Durations = { hissMs: 2000, sirenMs: 4000 },
) {
  let context: AudioContext | null = null
  let output: GainNode | null = null

  function tone(frequency: number, start: number, length: number, type: OscillatorType = 'sine', peak = 1) {
    const oscillator = context!.createOscillator()
    const gain = context!.createGain()
    oscillator.type = type
    oscillator.frequency.value = frequency
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(peak, start + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, start + length)
    oscillator.connect(gain).connect(output!)
    oscillator.start(start)
    oscillator.stop(start + length)
  }

  function hiss(start: number, length: number) {
    const buffer = context!.createBuffer(1, Math.ceil(context!.sampleRate * length), context!.sampleRate)
    const samples = buffer.getChannelData(0)
    for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1
    const noise = context!.createBufferSource()
    noise.buffer = buffer
    const filter = context!.createBiquadFilter()
    filter.type = 'highpass'
    filter.frequency.value = 3000
    const gain = context!.createGain()
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(0.5, start + 0.1)
    gain.gain.setValueAtTime(0.5, start + length - 0.3)
    gain.gain.linearRampToValueAtTime(0, start + length)
    noise.connect(filter).connect(gain).connect(output!)
    noise.start(start)
  }

  const sounds: Record<Sound, (now: number) => void> = {
    step: (now) => tone(520, now, 0.08, 'triangle'),
    hiss: (now) => hiss(now, durations.hissMs / 1000),
    chime: (now) => [523, 659, 784, 1047].forEach((frequency, i) => tone(frequency, now + i * 0.12, 0.6)),
    siren: (now) => {
      const half = 0.4
      const halves = Math.floor(durations.sirenMs / 1000 / half)
      for (let i = 0; i < halves; i++) tone(i % 2 === 0 ? 880 : 660, now + i * half, half, 'triangle', 0.6)
    },
  }

  return {
    unlock() {
      if (!context) {
        context = makeContext()
        output = context.createGain()
        output.gain.value = volume
        output.connect(context.destination)
      }
      if (context.state === 'suspended') void context.resume()
    },
    play(sound: Sound) {
      if (!context) return
      sounds[sound](context.currentTime)
    },
  }
}
