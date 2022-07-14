export enum TileStatuses {
  HIDDEN = "hidden",
  MINE = "mine",
  NUMBER = "number",
  MARKED = "marked",
}

export type Tile = {
  el: HTMLDivElement
  x: number
  y: number
  mine: boolean
  get status(): string | undefined
  set status(value: string | undefined)
}

export type Pos = {
  x: number
  y: number
}
