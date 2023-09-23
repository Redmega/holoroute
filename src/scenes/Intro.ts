import { GameObjects, Scene } from 'phaser'
import { COLORS } from '../util/color'
import MainScene from './Main'
import { wait } from '../util/time'
import { RECT_PADDING, RECT_STROKE } from '../util/size'
import Button from '../objects/Button'

export default class IntroScene extends Scene {
  static key = 'IntroScene'

  text!: GameObjects.Text
  button!: Button

  constructor() {
    super({ key: IntroScene.key, active: true })
  }

  create() {
    // If we've done the intro (user has pressed "play") don't try to load this scene
    if (this.registry.get('intro:done')) {
      this.scene.remove(IntroScene.key)
      return
    }

    // get reference to main camera
    const camera = this.scene.get(MainScene.key).cameras.main

    // generate background box for our "terminal"
    const background = this.add
      .rectangle(
        camera.x + RECT_STROKE,
        camera.height / 2 - RECT_STROKE,
        camera.width - RECT_STROKE,
        camera.height / 2,
        COLORS.Grey,
        0.9
      )
      .setStrokeStyle(RECT_STROKE, COLORS.DarkGreen)
      .setOrigin(0)

    // setup our text container
    this.text = this.add.text(background.x + RECT_PADDING, background.y + RECT_PADDING * 2, '', {
      wordWrap: { width: background.width - RECT_PADDING },
      lineSpacing: RECT_PADDING,
    })

    // play our opening sequence
    this.openingSequence(true).then(() => {
      this.button = new Button(this, {
        x: camera.width / 2,
        y: this.text.getBounds().bottom + RECT_PADDING * 2,
        callback: this.startGame,
        text: 'accept',
      }).create()
    })
  }

  update() {}

  protected startGame() {
    this.registry.set('intro:done', true)
    this.scene.remove(IntroScene.key)
  }

  protected async openingSequence(skip?: boolean) {
    const prefix = '|> '
    const content = [
      'hello <user>. welcome to [holoroute]',
      'there are no paths left. our world is disconnected.',
      'our community has fractured. we need your help.',
      'can you bridge the gaps?',
    ]

    if (skip) {
      this.text.text = content.map((line) => prefix + line).join('\n')
      return
    }

    // phase 1
    await this.writeText('/// INCOMING TRANSMISSION.')
    await this.writeText('\n/// WARNING: DATA CORRUPTED.')
    await wait(75)
    this.clearText()

    // phase 2 - jarbled mess
    await Promise.all(content.concat(content).map((string) => this.writeText(string, 25)))
    await this.writeText('\n\n/// ATTEMPTING DATA RECOVERY   ') // these spaces get replaced by periods
    for (let i = 0; i < 5; i++) {
      this.text.text = this.text.text.substring(0, this.text.text.length - 3)
      await this.writeText('...', 150)
      await wait(75)
    }
    this.clearText()

    // phase 3 - actual content
    for (const item of content) {
      await this.writeText(prefix + item + '\n')
    }
  }

  private clearText() {
    this.text.text = ''
  }

  private async writeText(string: string, speed = 75) {
    let i = 0
    const event = this.time.addEvent({
      callback: () => {
        this.text.text += string[i++]
      },
      repeat: string.length - 1,
      delay: speed,
    })
    return new Promise((resolve) => {
      this.time.addEvent({ callback: resolve, delay: event.getOverallRemaining() + speed * 2 })
    })
  }
}
