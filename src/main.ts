import IntroScene from './scenes/Intro'
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
  scene: [MainScene, IntroScene],
})

// Load data from localStorage
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i)
  if (key) game.registry.set(key, JSON.parse(localStorage.getItem(key)!))
}

// Setup listeners that persist data to localStorage
const onChangeData = (_: typeof game, key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value))
}

game.registry.events.on('setdata', onChangeData)
game.registry.events.on('changedata', onChangeData)

// @ts-ignore
globalThis.__PHASER_GAME__ = game
