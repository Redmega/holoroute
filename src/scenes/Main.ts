import { GameObjects, Input, Scene } from 'phaser'
import Hub from '../objects/Hub'
import { COLORS, getRandomColor } from '../util/color'
import { RECT_PADDING, RECT_STROKE } from '../util/size'
import { CompleteRouteArgs, Events, StartRouteArgs } from '../util/events'
import DashedLine from '../objects/DashedLine'

/**
 *  The Main Scene is always active and includes our global game state (probably)
 *  */
export default class MainScene extends Scene {
  static key = 'MainScene'

  mainHub!: Hub
  hubs: Hub[] = []

  routeTarget?: GameObjects.Arc
  originHub?: Hub
  routeLine?: DashedLine

  protected routes: Record<string, Set<string>> = {}

  constructor() {
    super({ key: MainScene.key })
  }

  preload() {
    // Preload assets (e.g., sprites, images, etc.)
  }

  create() {
    // Initialize game objects
    this.mainHub = new Hub(this, {
      id: 'main',
      x: this.cameras.main.centerX - 128 * 1.5,
      y: this.cameras.main.centerY,
      fillColor: COLORS.DarkGreen,
      strokeColor: COLORS.LightGreen,
      generates: { resource: 'a', interval: 1000 },
    }).create()

    this.hubs.push(
      new Hub(this, {
        id: 'test',
        fillColor: COLORS.White,
        x: this.cameras.main.centerX + 128 * 1.5,
        y: this.mainHub.y,
      }).create()
    )

    this.events.on(Events.Hub.StartRoute, ({ origin }: StartRouteArgs) => {
      this.originHub = this.children.getByName(origin) as Hub
      if (!this.originHub) return

      this.registry.set('isCreatingRoute', origin)
      const pointer = this.input.activePointer
      this.routeTarget = this.add.circle(pointer.x, pointer.y, 8, COLORS.Purple).setOrigin(0.5)
      this.drawRouteLine(pointer)
    })

    this.events.on(Events.Hub.CompleteRoute, ({ origin, target }: CompleteRouteArgs) => {
      this.originHub = this.children.getByName(origin) as Hub
      const targetHub = this.children.getByName(target) as Hub
      if (!this.originHub || !targetHub) return

      this.originHub.addRouteTo(target)
      this.routes[origin] ??= new Set<string>()
      this.routes[origin].add(target)

      this.registry.set('isCreatingRoute', undefined)
      this.routeTarget?.destroy()
      this.routeLine?.destroy()
    })

    this.input.on('pointermove', (pointer: Input.Pointer) => {
      if (this.originHub) {
        this.routeTarget?.setPosition(pointer.x, pointer.y)
        this.drawRouteLine(pointer)
      }
    })
  }

  update(time: number, delta: number) {
    // Game update logic
    this.mainHub.update(time, delta)
    for (const hub of this.hubs) {
      hub.update(time, delta)
    }

    this.drawHubRoutes()
  }

  private drawHubRoutes() {
    for (const [origin, targets] of Object.entries(this.routes)) {
      for (const target of targets) {
        const originHub = this.children.getByName(origin) as Hub
        const targetHub = this.children.getByName(target) as Hub
        if (!originHub || !targetHub) continue

        const line =
          (this.children.getByName(`route:${origin}:${target}`) as DashedLine) ||
          new DashedLine(this, {
            start: originHub,
            end: targetHub,
            dashSize: RECT_STROKE,
            lineStyle: { color: COLORS.Purple, width: RECT_STROKE / 1.5 },
          }).setName(`route:${origin}:${target}`)

        line.draw()
      }
    }
  }

  private drawRouteLine(pointer: Input.Pointer) {
    if (!this.originHub) return
    if (!this.routeLine)
      this.routeLine = new DashedLine(this, {
        start: this.originHub,
        end: pointer,
        dashSize: RECT_STROKE,
        lineStyle: { color: COLORS.White, width: RECT_STROKE / 2 },
      })

    this.routeLine.setEnd(pointer).draw()
  }
}
