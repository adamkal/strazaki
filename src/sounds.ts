import { isSameTile, type Game } from './game'

export type Sound = 'step' | 'hiss' | 'chime' | 'siren'

export function soundsFor(before: Game, after: Game): Sound[] {
  const sounds: Sound[] = []
  if (!isSameTile(before.firefighter, after.firefighter)) sounds.push('step')
  if (!before.extinguishing && after.extinguishing) sounds.push('hiss')
  if (!before.celebration && after.celebration) sounds.push(after.celebration === 'big' ? 'siren' : 'chime')
  return sounds
}
