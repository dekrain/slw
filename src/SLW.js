// @flow

// SUPER LIAM WORLD(tm)
// totally not stolen from an-ok-squirrel.
// this is a fair use of the name as specified
// in NANALAND RULES NUMBER #99

type Position = [number, number]

const trimLines = require('trim-lines')

import Tile from './Tile'
import { Player } from './Entity'

export default class SLW {
  // Map to store key-pressed data in.
  keys: Object

  // Canvas used to display the game on.
  canvas: HTMLCanvasElement

  // Player object - the character that walks around the screen using the
  // user's input as controls.
  player: Player

  // Camera object - where the camera is.
  camera: Position

  // Level object, to contain information about the currently active level.
  activeLevel: { tiles: string }

  // A basic tileset image to grab tile textures from.
  tileset: Image

  constructor() {
    this.keys = {}

    this.canvas = document.createElement('canvas')
    this.canvas.width = 256
    this.canvas.height = 256

    this.canvas.addEventListener('keydown', (evt: KeyboardEvent) => {
      this.keys[evt.keyCode] = true
    })

    this.canvas.addEventListener('keyup', (evt: KeyboardEvent) => {
      this.keys[evt.keyCode] = false
    })

    this.canvas.setAttribute('tabindex', '1')

    this.player = new Player(16, 16)

    // @TODO Camera position:
    this.camera = [0, 0]

    this.activeLevel = {
      tiles: trimLines`--------------------
                       --------------------
                       --------------------
                       --------------------
                       ----------------===-
                       --------------------
                       --------------------
                       --------===---------
                       --------------------
                       ==------------------
                       --------------------
                       ----------=?=-------
                       ------=-------------
                       -----===------------
                       ----=====----===----
                       =================---
                       ====================`
    }
  }

  // Clears the game canvas.
  canvasClear() {
    const ctx = this.canvas.getContext('2d')

    if (ctx instanceof CanvasRenderingContext2D)
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  // Gets the drawn position of a given tile position. For example, assuming
  // that the tile size is 16, getDrawnPosition([0, 2]) would become [0, 32].
  getDrawnPosition([tileX, tileY]: Position): Position {
    return [
      Math.floor(tileX * Tile.size),
      Math.floor(tileY * Tile.size)
    ]
  }

  // Draws all of the active level's tiles.
  drawLevelTiles() {
    const rows = this.activeLevel.tiles.split('\n')
    const ctx = this.canvas.getContext('2d')

    if(ctx instanceof CanvasRenderingContext2D) {
      const viewStartX = 0
      const viewStartY = 0
      const viewEndX = 16
      const viewEndY = 16

      for (let y = viewStartY; y < viewEndY; y++) {
        for (let x = viewStartX; x < viewEndX; x++) {
          let row = rows[y] || []
          let tile = row[x] || ''

          const [rendX, rendY] = this.getDrawnPosition([x, y])
          const [tileX, tileY] = Tile.get(tile).position
          ctx.drawImage(
            this.tileset,
            tileX * Tile.size, tileY * Tile.size,
            Tile.size, Tile.size,

            rendX, rendY, Tile.size, Tile.size)
        }
      }
    }
  }

  // Place a tile at a specific position.
  // @TODO: should this be in Tile?
  placeTile([tileX: number, tileY: number]: Position, type: string) {
    const rows = this.activeLevel.tiles.split('\n')
    const newRow = rows[tileY].split('')
    newRow[tileX] = type
    rows[tileY] = newRow.join('')
    this.activeLevel.tiles = rows.join('\n')
  }
}
