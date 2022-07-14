import { Pos, Tile, TileStatuses } from "./Types"

export function createBoard(boardSize: number, minesCount: number): Tile[][] {
  const board: Tile[][] = []
  const minesPos: Pos[] = getMinesPos(boardSize, minesCount)

  for (let x = 0; x < boardSize; x++) {
    const row: Tile[] = []
    for (let y = 0; y < boardSize; y++) {
      const el = document.createElement("div") as HTMLDivElement
      el.dataset.status = TileStatuses.HIDDEN

      const tile: Tile = {
        el,
        x,
        y,
        mine: minesPos.some((p) => positionMatch(p, { x, y })),
        get status(): string | undefined {
          return this.el.dataset.status
        },
        set status(value: string | undefined) {
          this.el.dataset.status = value
        },
      }

      row.push(tile)
    }
    board.push(row)
  }
  return board
}

// Get all positions of mines on the board
function getMinesPos(boardSize: number, minesCount: number) {
  const positions: Pos[] = []

  while (positions.length < minesCount) {
    const position: Pos = {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize),
    }

    if (!positions.some((p) => positionMatch(p, position))) {
      positions.push(position)
    }
  }

  return positions
}

function positionMatch(a: Pos, b: Pos): boolean {
  return a.x === b.x && a.y === b.y
}

// Mark tiles
export function markTiles(tile: Tile): void {
  if (
    tile.status !== TileStatuses.HIDDEN &&
    tile.status !== TileStatuses.MARKED
  )
    return

  tile.status === TileStatuses.MARKED
    ? (tile.status = TileStatuses.HIDDEN)
    : (tile.status = TileStatuses.MARKED)
}

// Reveal tiles
export function revealTiles(board: Tile[][], tile: Tile): void {
  if (tile.status !== TileStatuses.HIDDEN) return

  if (tile.mine) {
    tile.status = TileStatuses.MINE
    return
  }

  tile.status = TileStatuses.NUMBER

  const adjacentTiles = nearbyTiles(board, tile)

  const mines = adjacentTiles.filter((tile) => tile.mine)

  if (mines.length === 0) {
    adjacentTiles.forEach(revealTiles.bind(null, board))
  } else {
    tile.el.textContent = mines.length.toString()
  }
}

function nearbyTiles(board: Tile[][], { x, y }: Tile) {
  const tiles = []

  for (let offsetX = -1; offsetX <= 1; offsetX++) {
    for (let offsetY = -1; offsetY <= 1; offsetY++) {
      const tile = board[offsetX + x]?.[offsetY + y]

      tile && tiles.push(tile)
    }
  }

  return tiles
}

// Check Winning
export function checkWin(board: Tile[][]): boolean {
  return board.every((row) => {
    return row.every((tile) => {
      return (
        tile.status === TileStatuses.NUMBER ||
        (tile.mine &&
          (tile.status === TileStatuses.HIDDEN || TileStatuses.MARKED))
      )
    })
  })
}

// Check losing
export function checkLose(board: Tile[][]): boolean {
  return board.some((row) => {
    return row.some((tile) => {
      return tile.status === TileStatuses.MINE
    })
  })
}
