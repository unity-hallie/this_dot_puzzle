import type { Puzzle } from '../../puzzleUtils'

export default {
  id: 'closures-1',
  title: 'Count Privately',
  hidden_vars: [{
    hint: "third time's the charm",
    vars: {
      THIRD_COUNT: 3
    }
  }],
  code: `
function makeCounter() { // @locked
let count = 0 // @mandatory
return () => ++count // @mandatory
} // @locked
const c = makeCounter() // @locked
c() // @locked
c() // @locked
c() === THIRD_COUNT // @test c() === _____ // third time's the charm
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints (Closures — Counter)
- Closures capture variables; subsequent calls see updated state.
- ChatGPT: Generate puzzles with functions returning closures that capture and mutate state.
*/
