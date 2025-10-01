import type { Puzzle } from '../../puzzleUtils'

export default {
  id: 'arrows-2',
  title: 'Carry the Factor',
  clue: 'triple play',
  code: `
const nums = [1,2,3] // @locked
let factor = 3 // @mandatory
const out = nums.map(n => n * factor) // @mandatory
out.join(',') === '3,6,9' // @test out.join(',') === '_,_,_' // triple play
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints (Arrow + map)
- Demonstrate capturing external values and mapping; short and focused.
- ChatGPT: Ask for desired topics; emit more modules with the same markers and shape.
*/
