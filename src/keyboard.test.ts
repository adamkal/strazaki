import { describe, expect, it } from 'vitest'
import { directionForKey } from './keyboard'

describe('directionForKey', () => {
  it.each([
    ['ArrowUp', 'up'],
    ['ArrowDown', 'down'],
    ['ArrowLeft', 'left'],
    ['ArrowRight', 'right'],
  ] as const)('maps %s to %s', (key, direction) => {
    expect(directionForKey(key)).toBe(direction)
  })

  it.each(['a', 'Enter', ' '])('ignores the %j key', (key) => {
    expect(directionForKey(key)).toBeUndefined()
  })
})
