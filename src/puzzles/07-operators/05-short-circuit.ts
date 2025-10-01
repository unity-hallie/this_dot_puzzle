import type { Puzzle } from '../../puzzleUtils'

/*
Puzzle DSL and Prompt Hints (Weird Operators — Short Circuit)
- Demonstrate operator precedence with && and || using parentheses.
- ChatGPT: Ask for desired complexity, then output more modules with the same DSL.
*/

export default {
  id: 'ops-5',
  title: 'Short Circuit',
  clue: 'and/or',
  code: `
const ready = true // @locked
const count = 0 // @locked
const force = true // @locked
let ok // @locked
ok = ready && (count > 0 || force)
ok === true // @test ok === ____ // and/or
  `.trim()
} satisfies Puzzle

