import { describe, expect, it, vi } from 'vitest'
import { createAudio } from './audio'

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
    const audio = createAudio(makeContext)

    audio.play('step')
    audio.play('siren')

    expect(makeContext).not.toHaveBeenCalled()
  })

  it('creates the AudioContext once, on the first unlock', () => {
    const makeContext = vi.fn(() => fakeContext('running'))
    const audio = createAudio(makeContext)

    audio.unlock()
    audio.unlock()

    expect(makeContext).toHaveBeenCalledTimes(1)
  })

  it('resumes a suspended AudioContext when unlocked again', () => {
    const context = fakeContext('suspended')
    const audio = createAudio(() => context)

    audio.unlock()
    audio.unlock()

    expect(context.resume).toHaveBeenCalled()
  })
})
