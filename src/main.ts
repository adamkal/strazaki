import { endCelebration, isSameTile, moveFirefighter, newGame, putOutFire, type Game } from './game'
import { directionForKey } from './keyboard'

const extinguishingMs = 2000
const celebrationMs = { small: 1500, big: 4000 }

const boardElement = document.querySelector<HTMLElement>('#board')!
const tallyElement = document.querySelector<HTMLElement>('#tally')!
const fireEngineElement = document.querySelector<HTMLElement>('#fire-engine')!
let game = newGame()
boardElement.style.setProperty('--extinguishing-ms', `${extinguishingMs}ms`)
fireEngineElement.style.setProperty('--big-celebration-ms', `${celebrationMs.big}ms`)

function renderStars(tile: HTMLElement) {
  for (let i = 0; i < 8; i++) {
    const star = document.createElement('span')
    star.className = 'star'
    star.textContent = '⭐'
    star.style.setProperty('--angle', `${i * 45}deg`)
    tile.append(star)
  }
}

function render(game: Game) {
  boardElement.style.setProperty('--cols', String(game.board.width))
  boardElement.style.setProperty('--rows', String(game.board.height))
  const tiles: HTMLElement[] = []
  for (let y = 0; y < game.board.height; y++) {
    for (let x = 0; x < game.board.width; x++) {
      const tile = document.createElement('div')
      tile.className = 'tile'
      if (isSameTile({ x, y }, game.firefighter)) tile.textContent = '🧑‍🚒'
      if (isSameTile({ x, y }, game.fire) && game.celebration) {
        renderStars(tile)
      } else if (isSameTile({ x, y }, game.fire)) {
        const fire = document.createElement('span')
        fire.className = 'fire'
        fire.textContent = '🔥'
        tile.append(fire)
        if (game.extinguishing) tile.classList.add('extinguishing')
      }
      tiles.push(tile)
    }
  }
  boardElement.replaceChildren(...tiles)
  tallyElement.textContent = '⭐'.repeat(game.tally)
  fireEngineElement.hidden = game.celebration !== 'big'
}

function celebrate() {
  if (!game.celebration) return
  setTimeout(() => {
    game = endCelebration(game)
    render(game)
  }, celebrationMs[game.celebration])
}

window.addEventListener('keydown', (event) => {
  const direction = directionForKey(event.key)
  if (!direction) return
  event.preventDefault()
  const next = moveFirefighter(game, direction)
  if (next === game) return
  game = next
  render(game)
  if (game.extinguishing) {
    setTimeout(() => {
      game = putOutFire(game)
      render(game)
      celebrate()
    }, extinguishingMs)
  }
})

render(game)
