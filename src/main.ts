import "./style.css"
import {
  checkLose,
  checkWin,
  createBoard,
  markTiles,
  revealTiles,
} from "./minesweeper"

import { TileStatuses } from "./types"

// Grab DOM elements
const messageText = document.querySelector(
  ".game-status"
) as HTMLParagraphElement
const boardEl = document.querySelector(".board") as HTMLDivElement
const minesLeft = document.querySelector(
  "[data-mines-count]"
) as HTMLSpanElement
const overlay = document.querySelector(".replay-overlay") as HTMLDivElement
const replayBtn = document.querySelector(".replay-btn") as HTMLButtonElement

// Set game constants
const BOARD_SIZE: number = 10
const MINES_COUNT: number = 10

const board = createBoard(BOARD_SIZE, MINES_COUNT)
boardEl.style.setProperty("--size", BOARD_SIZE.toString())

board.forEach((row) => {
  row.forEach((tile) => {
    boardEl.appendChild(tile.el)

    tile.el.addEventListener("click", () => {
      revealTiles(board, tile)
      checkEndGame()
    })

    tile.el.addEventListener("contextmenu", (e: MouseEvent) => {
      e.preventDefault()

      markTiles(tile)

      minesLeftCount()
    })
  })
})

// Change mines count dynamically
minesLeft.textContent = MINES_COUNT.toString()

function minesLeftCount() {
  const markedTilesCount = board.reduce((count, row) => {
    return (
      count + row.filter((tile) => tile.status === TileStatuses.MARKED).length
    )
  }, 0)

  minesLeft.textContent = `${MINES_COUNT - markedTilesCount}`
}

// Check end game
function checkEndGame() {
  const win = checkWin(board)
  const lose = checkLose(board)

  //! Stop clicking events as game concludes

  if (win || lose) {
    boardEl.addEventListener(
      "click",
      (e) => {
        e.stopImmediatePropagation()
      },
      { capture: true }
    )

    boardEl.addEventListener(
      "contextmenu",
      (e) => {
        e.stopImmediatePropagation()
      },
      { capture: true }
    )
  }

  //* Display winning or losing message

  if (win) {
    overlay.classList.remove("hidden")
    messageText.innerHTML = `<p class="game-status">لقد ربحت!! <i class="fa-solid fa-party-horn"></i></p>`

    replayBtn.addEventListener("click", () => {
      overlay.classList.add("hidden")

      window.location.reload()
    })
  }

  if (lose) {
    overlay.classList.remove("hidden")
    messageText.innerHTML = `<p class="game-status"> لقد خسرت!! <i class="fa-solid fa-face-frown"></i></p>`
    board.forEach((row) => {
      row.forEach((tile) => {
        if (tile.status === TileStatuses.MARKED) markTiles(tile)
        if (tile.mine) revealTiles(board, tile)
      })
    })

    replayBtn.addEventListener("click", () => {
      overlay.classList.add("hidden")

      window.location.reload()
    })
  }
}
