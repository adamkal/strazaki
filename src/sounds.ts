import { isSameTile, type Celebration, type Game } from './game'

export type Sound = 'step' | 'hiss' | 'chime' | 'siren'

const celebrationSounds: Record<Celebration, Sound> = { small: 'chime', big: 'siren' }

export function soundsFor(before: Game, after: Game): Sound[] {
  const sounds: Sound[] = []
  if (!isSameTile(before.firefighter, after.firefighter)) sounds.push('step')
  if (!before.extinguishing && after.extinguishing) sounds.push('hiss')
  if (!before.celebration && after.celebration) sounds.push(celebrationSounds[after.celebration])
  return sounds
}
