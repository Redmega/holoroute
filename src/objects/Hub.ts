import { GameObjects, Scene, Physics } from 'phaser'

interface HubOptions {
  id: string
  x: number
  y: number
  width?: number
  height?: number
  fillColor: number
  fillAlpha?: number
  strokeColor?: number
  strokeAlpha?: number
  origin?: number
}

export default class Hub {
  private options: HubOptions
  protected scene: Scene
  protected graphic?: GameObjects.Rectangle

  constructor(scene: Scene, options: HubOptions) {
    this.scene = scene
    this.options = options
  }

  get id() {
    return this.options.id
  }

  create() {
    const {
      x,
      y,
      height,
      width,
      fillColor,
      fillAlpha = 0.5,
      strokeColor = fillColor,
      strokeAlpha = 1.0,
      origin = 0.5,
    } = this.options
    this.graphic = this.scene.add
      .rectangle(x, y, width, height, fillColor, fillAlpha)
      .setStrokeStyle(4, strokeColor, strokeAlpha)
      .setOrigin(origin)
  }

  update() {
    // game update logic
  }
}
