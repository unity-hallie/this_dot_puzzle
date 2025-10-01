import type { Puzzle } from '../../puzzleUtils'

export default {
  id: 'closures-1',
  title: 'Count Privately',
  clue: "third time's the charm",
  code: `
function makeCounter() { // @locked
let count = 0 // @mandatory
return () => ++count // @mandatory
} // @locked
const c = makeCounter() // @locked
c() // @locked
c() // @locked
c() // @locked
c() === 3 // @test c() === _____ // third time’s the charm
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints (Closures)
- Focus on captured state and factory functions; short, single-goal tasks.
- ChatGPT: Ask for topics/difficulty; generate modules with these markers and structure.
*/
