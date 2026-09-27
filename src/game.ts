export type Tile = { x: number; y: number }

export type Board = { width: number; height: number }

export type Game = {
  board: Board
  firefighter: Tile
}

export function newGame(): Game {
  return {
    board: { width: 8, height: 6 },
    firefighter: { x: 3, y: 2 },
  }
}

export function isOnBoard(board: Board, tile: Tile): boolean {
  return tile.x >= 0 && tile.x < board.width && tile.y >= 0 && tile.y < board.height
}

export function isSameTile(a: Tile, b: Tile): boolean {
  return a.x === b.x && a.y === b.y
}

export type Direction = 'up' | 'down' | 'left' | 'right'

type Step = { dx: number; dy: number }

const steps: Record<Direction, Step> = {
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
  left: { dx: -1, dy: 0 },
  right: { dx: 1, dy: 0 },
}

export function moveFirefighter(game: Game, direction: Direction): Game {
  const { dx, dy } = steps[direction]
  const tile = { x: game.firefighter.x + dx, y: game.firefighter.y + dy }
  if (!isOnBoard(game.board, tile)) return game
  return { ...game, firefighter: tile }
}
