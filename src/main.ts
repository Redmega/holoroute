import MainScene from './scenes/Main'
import './style.css'
import { Game } from 'phaser'

// initialize the game
const game = new Game({
  type: Phaser.AUTO,
  width: '100%',
  height: '100%',
  parent: 'app', // dom node id of parent container
  expandParent: true,
  title: 'holoroute', // TODO: Come up with a better name
  scene: MainScene,
})
