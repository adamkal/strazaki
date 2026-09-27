import { moveFirefighter, newGame, type Game } from './game'
import { directionForKey } from './keyboard'

const boardElement = document.querySelector<HTMLElement>('#board')!
let game = newGame()

function render(game: Game) {
  const tiles: HTMLElement[] = []
  for (let y = 0; y < game.board.height; y++) {
    for (let x = 0; x < game.board.width; x++) {
      const tile = document.createElement('div')
      tile.className = 'tile'
      if (x === game.firefighter.x && y === game.firefighter.y) tile.textContent = '🧑‍🚒'
      tiles.push(tile)
    }
  }
  boardElement.replaceChildren(...tiles)
}

window.addEventListener('keydown', (event) => {
  const direction = directionForKey(event.key)
  if (!direction) return
  event.preventDefault()
  game = moveFirefighter(game, direction)
  render(game)
})

render(game)
