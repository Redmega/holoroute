import { Game, GameObjects, Geom, Scene } from 'phaser'
import { RECT_PADDING } from '../util/size'
import { COLORS } from '../util/color'

interface ButtonOptions {
  x: number
  y: number
  callback: Function
  text: string
}

export default class Button extends GameObjects.Container {
  private options: ButtonOptions
  protected background!: GameObjects.Rectangle

  constructor(scene: Scene, options: ButtonOptions) {
    super(scene, options.x, options.y)
    this.options = options
  }

  create() {
    const { callback, text: content } = this.options

    const text = this.scene.add.text(0, 0, content).setOrigin(0.5)
    const textBounds = text.getBounds()

    const width = textBounds.width + RECT_PADDING * 2
    const height = textBounds.height + RECT_PADDING * 2
    this.background = this.scene.add.rectangle(0, 0, width, height, COLORS.DarkGreen, 1.0).setOrigin(0.5)

    this.add(this.background)
    this.add(text)

    this.setSize(width, height)

    // To detect interaction here we have to convert local point to global point by adding our container x+y
    this.setInteractive(this.getBounds(), (rect, x, y) => Geom.Rectangle.Contains(rect, x + rect.x, y + rect.y))

    this.on('pointerdown', callback, this.scene)
    this.scene.children.add(this)
    return this
  }
}
