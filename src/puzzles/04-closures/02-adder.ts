import type { Puzzle } from '../../puzzleUtils'

export default {
  id: 'closures-2',
  title: 'Remember the Number',
  legacy: true,
  hidden_vars: [{
    hint: "add five",
    vars: {
      EXPECTED_SUM: 13
    }
  }],
  code: `
function makeAdder(n) { // @locked
return (x) => x + n // @mandatory
} // @locked
const add5 = makeAdder(5) // @locked
add5(8) === EXPECTED_SUM // @test add5(8) === _____ // add five
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints (Closures — Factory)
- Factory functions return closures capturing parameters.
- ChatGPT: Create puzzles with factory patterns that capture and use parameters in returned functions.
*/
