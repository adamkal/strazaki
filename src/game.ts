export type Tile = { x: number; y: number }

export type Board = { width: number; height: number }

export type Game = {
  board: Board
  firefighter: Tile
  fire: Tile
  extinguishing: boolean
  tally: number
  celebration: Celebration | null
}

export type Celebration = 'small' | 'big'

export type Random = () => number

const minFireDistance = 3
const fullTally = 10

export function newGame(random: Random = Math.random): Game {
  const board = { width: 8, height: 6 }
  const firefighter = { x: 3, y: 2 }
  return {
    board,
    firefighter,
    fire: spawnFire(board, firefighter, random),
    extinguishing: false,
    tally: 0,
    celebration: null,
  }
}

function distance(a: Tile, b: Tile): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
}

function spawnFire(board: Board, firefighter: Tile, random: Random): Tile {
  const candidates: Tile[] = []
  for (let y = 0; y < board.height; y++) {
    for (let x = 0; x < board.width; x++) {
      if (distance({ x, y }, firefighter) >= minFireDistance) candidates.push({ x, y })
    }
  }
  return candidates[Math.floor(random() * candidates.length)]
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
  if (game.extinguishing || game.celebration) return game
  const { dx, dy } = steps[direction]
  const tile = { x: game.firefighter.x + dx, y: game.firefighter.y + dy }
  if (!isOnBoard(game.board, tile) || isSameTile(tile, game.fire)) return game
  return { ...game, firefighter: tile, extinguishing: distance(tile, game.fire) === 1 }
}

export function putOutFire(game: Game): Game {
  const tally = game.tally + 1
  return {
    ...game,
    extinguishing: false,
    tally,
    celebration: tally === fullTally ? 'big' : 'small',
  }
}

export function endCelebration(game: Game, random: Random = Math.random): Game {
  return {
    ...game,
    fire: spawnFire(game.board, game.firefighter, random),
    tally: game.celebration === 'big' ? 0 : game.tally,
    celebration: null,
  }
}
