import { isSameTile, moveFirefighter, newGame, putOutFire, type Game } from './game'
import { directionForKey } from './keyboard'

const extinguishingMs = 2000

const boardElement = document.querySelector<HTMLElement>('#board')!
let game = newGame()
boardElement.style.setProperty('--extinguishing-ms', `${extinguishingMs}ms`)

function render(game: Game) {
  boardElement.style.setProperty('--cols', String(game.board.width))
  boardElement.style.setProperty('--rows', String(game.board.height))
  const tiles: HTMLElement[] = []
  for (let y = 0; y < game.board.height; y++) {
    for (let x = 0; x < game.board.width; x++) {
      const tile = document.createElement('div')
      tile.className = 'tile'
      if (isSameTile({ x, y }, game.firefighter)) tile.textContent = '🧑‍🚒'
      if (isSameTile({ x, y }, game.fire)) {
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
    }, extinguishingMs)
  }
})

render(game)
