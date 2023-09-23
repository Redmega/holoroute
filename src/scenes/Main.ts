import { Scene } from 'phaser'
import Hub from '../objects/Hub'

export default class MainScene extends Scene {
  mainHub!: Hub

  constructor() {
    super({ key: 'MainScene' })
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
      fillColor: 0x00ff00,
    })

    this.mainHub.create()
  }

  update() {
    // Game update logic
    this.mainHub.update()
  }
}
