import type { Puzzle } from '../../puzzleUtils'

export default {
  id: 'arrows-1',
  title: 'Say It Concise',
  hidden_vars: [{
    hint: "double it",
    vars: {
      EXPECTED_RESULT: 42
    }
  }],
  code: `
const dbl = (x) => { // @locked
return x * 2 // @mandatory
} // @locked
dbl(21) === EXPECTED_RESULT // @test dbl(21) === _____ // double it
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints (Arrow Functions)
- Arrow syntax with explicit or implicit return.
- ChatGPT: Emit puzzles comparing arrow functions with traditional syntax.
*/
