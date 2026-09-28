import { newGame, type Game, type Tile } from './game'

export function gameWith(firefighter: Tile, fire: Tile, overrides: Partial<Game> = {}): Game {
  return { ...newGame(), firefighter, fire, ...overrides }
}
