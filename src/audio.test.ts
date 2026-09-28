import { describe, expect, it, vi } from 'vitest'
import { createAudio } from './audio'

const durations = { extinguishingMs: 2000, bigCelebrationMs: 4000 }

function fakeContext(state: AudioContextState) {
  const gain = { value: 1 }
  return {
    state,
    resume: vi.fn(() => Promise.resolve()),
    createGain: () => ({ gain, connect: vi.fn() }),
  } as unknown as AudioContext
}

describe('createAudio', () => {
  it('creates no AudioContext before it is unlocked', () => {
    const makeContext = vi.fn(() => fakeContext('running'))
    const audio = createAudio(durations, makeContext)

    audio.play('step')
    audio.play('siren')

    expect(makeContext).not.toHaveBeenCalled()
  })

  it('creates the AudioContext once, on the first unlock', () => {
    const makeContext = vi.fn(() => fakeContext('running'))
    const audio = createAudio(durations, makeContext)

    audio.unlock()
    audio.unlock()

    expect(makeContext).toHaveBeenCalledTimes(1)
  })

  it('resumes the AudioContext when the browser has suspended it', () => {
    const context = fakeContext('running')
    const audio = createAudio(durations, () => context)

    audio.unlock()
    expect(context.resume).not.toHaveBeenCalled()
    ;(context as { state: AudioContextState }).state = 'suspended'
    audio.unlock()

    expect(context.resume).toHaveBeenCalledTimes(1)
  })

  it('stays silent instead of throwing when Web Audio is unavailable', () => {
    const audio = createAudio(durations, () => {
      throw new ReferenceError('AudioContext is not defined')
    })

    expect(() => audio.unlock()).not.toThrow()
    expect(() => audio.play('step')).not.toThrow()
  })
})
