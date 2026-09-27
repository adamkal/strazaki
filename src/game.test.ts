import { describe, expect, it } from 'vitest'
import { moveFirefighter, newGame } from './game'

describe('newGame', () => {
  it('starts with an 8×6 Board and the Firefighter near the middle', () => {
    const game = newGame()

    expect(game.board).toEqual({ width: 8, height: 6 })
    expect(game.firefighter).toEqual({ x: 3, y: 2 })
  })
})

describe('moveFirefighter', () => {
  it.each([
    ['up', { x: 3, y: 1 }],
    ['down', { x: 3, y: 3 }],
    ['left', { x: 2, y: 2 }],
    ['right', { x: 4, y: 2 }],
  ] as const)('moves the Firefighter one Tile %s', (direction, expected) => {
    const game = moveFirefighter(newGame(), direction)

    expect(game.firefighter).toEqual(expected)
  })
})

describe('moveFirefighter at the Board edge', () => {
  it.each([
    ['up', { x: 3, y: 0 }],
    ['down', { x: 3, y: 5 }],
    ['left', { x: 0, y: 2 }],
    ['right', { x: 7, y: 2 }],
  ] as const)('stays put when moving %s off the Board', (direction, edgeTile) => {
    const game = { ...newGame(), firefighter: edgeTile }

    expect(moveFirefighter(game, direction).firefighter).toEqual(edgeTile)
  })
})
