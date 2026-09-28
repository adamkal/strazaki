import { describe, expect, it } from 'vitest'
import { endCelebration, moveFirefighter, putOutFire } from './game'
import { soundsFor } from './sounds'
import { gameWith } from './test-helpers'

describe('soundsFor', () => {
  it('plays a step blip when the Firefighter moves', () => {
    const before = gameWith({ x: 3, y: 2 }, { x: 7, y: 5 })
    const after = moveFirefighter(before, 'right')

    expect(soundsFor(before, after)).toEqual(['step'])
  })

  it('plays nothing when the Firefighter stays put at the Board edge', () => {
    const before = gameWith({ x: 0, y: 0 }, { x: 7, y: 5 })
    const after = moveFirefighter(before, 'up')

    expect(soundsFor(before, after)).toEqual([])
  })

  it('plays a step and the water hiss when the Firefighter reaches a Fire', () => {
    const before = gameWith({ x: 3, y: 2 }, { x: 5, y: 2 })
    const after = moveFirefighter(before, 'right')

    expect(soundsFor(before, after)).toEqual(['step', 'hiss'])
  })

  it('plays a chime when a Celebration starts', () => {
    const before = gameWith({ x: 4, y: 2 }, { x: 5, y: 2 }, { extinguishing: true })

    expect(soundsFor(before, putOutFire(before))).toEqual(['chime'])
  })

  it('plays the siren when the Big Celebration starts', () => {
    const before = gameWith({ x: 4, y: 2 }, { x: 5, y: 2 }, { extinguishing: true, tally: 9 })

    expect(soundsFor(before, putOutFire(before))).toEqual(['siren'])
  })

  it('plays nothing when a Celebration ends', () => {
    const before = putOutFire(gameWith({ x: 4, y: 2 }, { x: 5, y: 2 }, { extinguishing: true }))

    expect(soundsFor(before, endCelebration(before))).toEqual([])
  })
})
