import { GameObjects, Scene, Types } from 'phaser'

interface DashedLineOptions {
  start: Types.Math.Vector2Like
  end: Types.Math.Vector2Like
  dashSize?: number
}

export default class DashedLine extends GameObjects.Graphics {
  private options: DashedLineOptions
  constructor(scene: Scene, options: DashedLineOptions & Types.GameObjects.Graphics.Options) {
    super(scene, options)
    this.options = options

    scene.add.existing(this)
  }

  setStart(start: Types.Math.Vector2Like) {
    this.options.start = start
    return this
  }

  setEnd(end: Types.Math.Vector2Like) {
    this.options.end = end
    return this
  }

  draw() {
    const { start, end, dashSize = 10 } = this.options
    const startV = new Phaser.Math.Vector2(start)
    const endV = new Phaser.Math.Vector2(end)
    // Calculate points for our dashed line
    const steps = new Phaser.Curves.Line(startV, endV).getSpacedPoints(0, dashSize)
    this.clear().moveTo(startV.x, startV.y)
    for (let i = 0; i < steps.length; i++) {
      const point = steps[i]
      if (i % 2) this.lineTo(point.x, point.y)
      else this.moveTo(point.x, point.y)
    }

    this.closePath().strokePath()
  }
}
