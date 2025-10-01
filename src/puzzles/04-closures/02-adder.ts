import type { Puzzle } from '../../puzzleUtils'

export default {
  id: 'closures-2',
  title: 'Remember the Number',
  clue: 'add five',
  code: `
function makeAdder(n) { // @locked
return (x) => x + n // @mandatory
} // @locked
const add5 = makeAdder(5) // @locked
add5(8) === 13 // @test add5(_____) === 13 // add five
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints (Closures)
- Emphasize lexical capture and returning functions; keep tests simple.
- ChatGPT: After asking the user for topics/difficulty, output more modules like this.
*/
