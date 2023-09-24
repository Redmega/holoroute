export const COLORS = {
  Pink: 0xfaa6ff,
  Purple: 0x7353ba,
  Black: 0x040f0f,
  DarkGreen: 0x248232,
  LightGreen: 0x2ba84a,
  Grey: 0x1e1e1e,
  White: 0xfcfffc,
  Red: 0xff4141,
  Yellow: 0xfbff41,
} as const

export function getRandomColor() {
  const colors = Object.values(COLORS).slice(1)
  return colors[Math.floor(Math.random() * colors.length)]
}
