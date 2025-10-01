import type { Puzzle } from '../../puzzleUtils'

export default {
  id: 'ops-5',
  title: 'Short Circuit',
  legacy: true,
  hidden_vars: [{
    hint: "and/or",
    vars: {
      SHOULD_PROCEED: true
    }
  }],
  code: `
const ready = true // @locked
const count = 0 // @locked
const force = true // @locked
let ok // @locked
ok = ready && (count > 0 || force)
ok === SHOULD_PROCEED // @test ok === _____ // and/or
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints (Short Circuit Logic)
- && and || short-circuit evaluation; understand precedence and grouping.
- ChatGPT: Emit puzzles with nested boolean expressions requiring careful evaluation.
*/
