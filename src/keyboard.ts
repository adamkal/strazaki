import type { Direction } from './game'

const directions = new Map<string, Direction>([
  ['ArrowUp', 'up'],
  ['ArrowDown', 'down'],
  ['ArrowLeft', 'left'],
  ['ArrowRight', 'right'],
])

export function directionForKey(key: string): Direction | undefined {
  return directions.get(key)
}
