import { describe, expect, it } from 'vitest'
import {
  endCelebration,
  isOnBoard,
  isSameTile,
  moveFirefighter,
  newGame,
  putOutFire,
  type Tile,
} from './game'

function gameWith(firefighter: Tile, fire: Tile, extinguishing = false) {
  return { ...newGame(), firefighter, fire, extinguishing }
}

function tilesBetween(a: Tile, b: Tile): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

describe('newGame', () => {
  it('starts with an 8×6 Board and the Firefighter near the middle', () => {
    const game = newGame()

    expect(game.board).toEqual({ width: 8, height: 6 })
    expect(game.firefighter).toEqual({ x: 3, y: 2 })
  })

  it.each([
    [0, { x: 0, y: 0 }],
    [0.999, { x: 7, y: 5 }],
  ])('places the first Fire using the random source (%d)', (value, fire) => {
    expect(newGame(() => value).fire).toEqual(fire)
  })

  it.each(Array.from({ length: 100 }, (_, i) => i / 100))(
    'places the first Fire at least 3 Tiles from the Firefighter (random %d)',
    (value) => {
      const game = newGame(() => value)

      expect(isOnBoard(game.board, game.fire)).toBe(true)
      expect(tilesBetween(game.fire, game.firefighter)).toBeGreaterThanOrEqual(3)
    },
  )
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

describe('isOnBoard', () => {
  const board = { width: 8, height: 6 }

  it.each([
    { x: 0, y: 0 },
    { x: 7, y: 5 },
    { x: 3, y: 2 },
  ])('is true for Tile %o', (tile) => {
    expect(isOnBoard(board, tile)).toBe(true)
  })

  it.each([
    { x: -1, y: 0 },
    { x: 0, y: -1 },
    { x: 8, y: 0 },
    { x: 0, y: 6 },
  ])('is false for Tile %o', (tile) => {
    expect(isOnBoard(board, tile)).toBe(false)
  })
})

describe('isSameTile', () => {
  it('is true for Tiles with the same position', () => {
    expect(isSameTile({ x: 3, y: 2 }, { x: 3, y: 2 })).toBe(true)
  })

  it.each([
    { x: 4, y: 2 },
    { x: 3, y: 3 },
  ])('is false for a different Tile %o', (tile) => {
    expect(isSameTile({ x: 3, y: 2 }, tile)).toBe(false)
  })
})

describe('moveFirefighter towards the Fire', () => {
  it('never enters the Fire Tile', () => {
    const game = gameWith({ x: 3, y: 2 }, { x: 4, y: 2 })

    expect(moveFirefighter(game, 'right').firefighter).toEqual({ x: 3, y: 2 })
  })

  it.each([
    ['right', { x: 5, y: 2 }],
    ['left', { x: 1, y: 2 }],
    ['up', { x: 3, y: 0 }],
    ['down', { x: 3, y: 4 }],
  ] as const)('starts Extinguishing when reaching the Fire by moving %s', (direction, fire) => {
    const game = gameWith({ x: 3, y: 2 }, fire)

    expect(moveFirefighter(game, direction).extinguishing).toBe(true)
  })

  it.each([
    ['right', { x: 5, y: 3 }],
    ['left', { x: 1, y: 1 }],
    ['up', { x: 4, y: 0 }],
    ['down', { x: 2, y: 4 }],
  ] as const)(
    'does not start Extinguishing when moving %s to a Tile diagonal to the Fire',
    (direction, fire) => {
      const game = gameWith({ x: 3, y: 2 }, fire)

      expect(moveFirefighter(game, direction).extinguishing).toBe(false)
    },
  )
})

describe('moveFirefighter during Extinguishing', () => {
  it.each(['up', 'down', 'left', 'right'] as const)('ignores moving %s', (direction) => {
    const extinguishingGame = gameWith({ x: 3, y: 2 }, { x: 4, y: 2 }, true)

    expect(moveFirefighter(extinguishingGame, direction)).toBe(extinguishingGame)
  })
})

describe('putOutFire', () => {
  const extinguishingGame = gameWith({ x: 0, y: 0 }, { x: 1, y: 0 }, true)

  it('ends Extinguishing', () => {
    expect(putOutFire(extinguishingGame).extinguishing).toBe(false)
  })
})

describe('endCelebration', () => {
  const celebratingGame = putOutFire(gameWith({ x: 0, y: 0 }, { x: 1, y: 0 }, true))

  it('ends the Celebration so the Firefighter can move again', () => {
    const game = endCelebration(celebratingGame, () => 0)

    expect(game.celebration).toBeNull()
    expect(moveFirefighter(game, 'down').firefighter).toEqual({ x: 0, y: 1 })
  })

  it('places the next Fire using the random source', () => {
    expect(endCelebration(celebratingGame, () => 0).fire).toEqual({ x: 3, y: 0 })
  })

  it('keeps the Tally after a small Celebration', () => {
    const game = endCelebration({ ...celebratingGame, tally: 4, celebration: 'small' })

    expect(game.tally).toBe(4)
  })

  it('empties the Tally after the Big Celebration', () => {
    const game = endCelebration({ ...celebratingGame, tally: 10, celebration: 'big' })

    expect(game.tally).toBe(0)
  })

  it.each(Array.from({ length: 100 }, (_, i) => i / 100))(
    'places the next Fire at least 3 Tiles from the Firefighter (random %d)',
    (value) => {
      const game = endCelebration(celebratingGame, () => value)

      expect(isOnBoard(game.board, game.fire)).toBe(true)
      expect(tilesBetween(game.fire, game.firefighter)).toBeGreaterThanOrEqual(3)
    },
  )
})

describe('Tally', () => {
  it('starts empty', () => {
    expect(newGame().tally).toBe(0)
  })

  it('gains one icon for each extinguished Fire', () => {
    const game = putOutFire({ ...gameWith({ x: 0, y: 0 }, { x: 1, y: 0 }, true), tally: 3 })

    expect(game.tally).toBe(4)
  })
})

describe('Celebration', () => {
  const extinguishingGame = gameWith({ x: 0, y: 0 }, { x: 1, y: 0 }, true)

  it('is not happening at the start', () => {
    expect(newGame().celebration).toBeNull()
  })

  it('follows every Extinguishing', () => {
    expect(putOutFire(extinguishingGame).celebration).toBe('small')
  })

  it('is small while the Tally has fewer than 10 icons', () => {
    expect(putOutFire({ ...extinguishingGame, tally: 8 }).celebration).toBe('small')
  })

  it('is the Big Celebration when the Tally reaches 10 icons', () => {
    const game = putOutFire({ ...extinguishingGame, tally: 9 })

    expect(game.tally).toBe(10)
    expect(game.celebration).toBe('big')
  })
})

describe('moveFirefighter during a Celebration', () => {
  it.each([
    ['small', 'up'],
    ['small', 'right'],
    ['big', 'down'],
    ['big', 'left'],
  ] as const)('ignores moving during a %s Celebration (%s)', (celebration, direction) => {
    const celebratingGame = { ...gameWith({ x: 3, y: 2 }, { x: 6, y: 5 }), celebration }

    expect(moveFirefighter(celebratingGame, direction)).toBe(celebratingGame)
  })
})
