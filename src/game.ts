export type Tile = { x: number; y: number }

export type Game = {
  board: { width: number; height: number }
  firefighter: Tile
}

export function newGame(): Game {
  return {
    board: { width: 8, height: 6 },
    firefighter: { x: 3, y: 2 },
  }
}

export type Direction = 'up' | 'down' | 'left' | 'right'

const steps: Record<Direction, Tile> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

export function moveFirefighter(game: Game, direction: Direction): Game {
  const step = steps[direction]
  const x = game.firefighter.x + step.x
  const y = game.firefighter.y + step.y
  const onBoard = x >= 0 && x < game.board.width && y >= 0 && y < game.board.height
  if (!onBoard) return game
  return { ...game, firefighter: { x, y } }
}
