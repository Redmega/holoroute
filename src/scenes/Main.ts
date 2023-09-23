import { Scene } from 'phaser'
import Hub from '../objects/Hub'
import { COLORS } from '../util/color'
import IntroScene from './Intro'

/**
 *  The Main Scene is always active and includes our global game state (probably)
 *  */
export default class MainScene extends Scene {
  static key = 'MainScene'

  mainHub!: Hub

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
      x: this.cameras.main.centerX,
      y: this.cameras.main.centerY,
      fillColor: COLORS.DarkGreen,
      strokeColor: COLORS.LightGreen,
    }).create()
  }

  update() {
    // Game update logic
    this.mainHub.update()
  }
}
