import { GameObjects, Scene, Physics, Time } from 'phaser'
import { CompleteRouteArgs, Event, Events, StartRouteArgs, TransferRouteArgs } from '../util/events'
import { COLORS } from '../util/color'

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
  generates?: { resource: string; interval: number }
}

export default class Hub extends GameObjects.Container {
  private options: HubOptions

  protected graphic!: GameObjects.Rectangle
  protected label?: GameObjects.Text

  protected storage: Record<string, number> = {}
  protected generates?: { resource: string; interval: number }
  protected routes: Set<string> = new Set()

  private generateTimer?: Time.TimerEvent
  private routeTimer?: Time.TimerEvent

  // Route dragging
  private routeTarget?: GameObjects.Arc

  constructor(scene: Scene, options: HubOptions) {
    super(scene, options.x, options.y)
    this.options = options
    this.generates = options.generates
    this.setName(this.id)
  }

  get id() {
    return this.options.id
  }

  create() {
    const {
      height,
      width,
      fillColor,
      fillAlpha = 0.5,
      strokeColor = fillColor,
      strokeAlpha = 0.5,
      origin = 0.5,
    } = this.options
    this.graphic = this.scene.add
      .rectangle(this.x, this.y, width, height, fillColor, fillAlpha)
      .setStrokeStyle(4, strokeColor, strokeAlpha)
      .setOrigin(origin)
      .setDepth(1)
    this.setSize(this.graphic.width, this.graphic.height)

    this.setInteractive()
    this.on('pointerdown', () => {
      const isCreatingRoute = this.scene.registry.get('isCreatingRoute')
      if (!isCreatingRoute)
        this.scene.events.emit(Events.Hub.StartRoute, {
          origin: this.id,
        } as StartRouteArgs)
      else {
        if (this.id === isCreatingRoute) return // TODO: cancel route
        this.scene.events.emit(Events.Hub.CompleteRoute, {
          origin: isCreatingRoute,
          target: this.id,
        } as CompleteRouteArgs)
      }
    })

    if (this.generates) {
      this.generateTimer = this.scene.time.addEvent({
        callback: this.generate,
        callbackScope: this,
        loop: true,
        delay: this.generates.interval,
      })
      const boxBounds = this.graphic.getCenter()
      this.label = this.scene.add.text(boxBounds.x!, boxBounds.y!, `${this.storage[this.generates.resource] ?? 0}`)
      // center it
      this.label.setPosition(this.label.x - this.label.width / 2, this.label.y - this.label.height / 2)
    }

    this.routeTimer = this.scene.time.addEvent({
      callback: this.processRoutes,
      callbackScope: this,
      loop: true,
      delay: 500,
    })

    this.scene.events.on(Events.Hub.TransferResource, ({ target, resource }: TransferRouteArgs) => {
      if (this.id === target) {
        this.addResource(resource)
        console.log('got resource: ', this.storage)
      }
    })

    this.scene.children.add(this)
    return this
  }

  update(time: number, delta: number) {
    this.drawLabel()
  }

  addRouteTo(target: string) {
    this.routes.add(target)
  }

  addResource(resource: string) {
    this.storage[resource] ??= 0
    this.storage[resource]++
  }

  private processRoutes() {
    if (this.generates) {
      const { resource } = this.generates
      for (const target of this.routes) {
        if (this.storage[resource] > 0) {
          this.scene.events.emit(Events.Hub.TransferResource, { resource, target } as TransferRouteArgs)
          this.storage[resource]--
        }
      }
    }
  }

  get generatedResourceStorage() {
    if (!this.generates) return 0
    const { resource } = this.generates
    return this.storage[resource] ?? 0
  }

  private generate() {
    const { resource } = this.generates!
    this.addResource(resource)
  }

  private drawLabel() {
    if (this.label) {
      this.label.text = `${this.generatedResourceStorage}`
      const box = this.graphic.getCenter()
      this.label!.setPosition(box.x! - this.label.width / 2, box.y! - this.label.height / 2)
    }
  }
}
