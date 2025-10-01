import type { Puzzle } from '../../puzzleUtils'

export default {
  id: 'arrows-1',
  title: 'Say It Concise',
  clue: 'double it',
  code: `
const dbl = (x) => { // @locked
return x * 2 // @mandatory
} // @locked
dbl(21) === 42 // @test dbl(____) === 42 // double it
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints (Arrow functions)
- Prefer concise arrows and implicit returns; single, clear test.
- ChatGPT: Confirm scope/difficulty; output similar modules with these markers.
*/
