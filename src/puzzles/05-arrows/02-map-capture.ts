import type { Puzzle } from '../../puzzleUtils'

export default {
  id: 'arrows-2',
  title: 'Carry the Factor',
  legacy: true,
  hidden_vars: [{
    hint: "triple play",
    vars: {
      EXPECTED_OUTPUT: '3,6,9'
    }
  }],
  code: `
const nums = [1,2,3] // @locked
let factor = 3 // @mandatory
const out = nums.map(n => n * factor) // @mandatory
out.join(',') === EXPECTED_OUTPUT // @test out.join(',') === _____ // triple play
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints (Arrows + Capture)
- Arrows capture outer scope; useful with map/filter/reduce.
- ChatGPT: Generate puzzles combining arrows with array methods and scope capture.
*/
