import type { Puzzle } from '../../puzzleUtils'

export default {
  id: 'ops-8',
  title: 'Call If You Can',
  legacy: true,
  hidden_vars: [{
    hint: "optional() ??",
    vars: {
      MODE_FALLBACK: 'auto'
    }
  }],
  code: `
const api = {} // @locked
let mode // @locked
mode = api.getMode?.() ?? 'auto'
mode === MODE_FALLBACK // @test mode === _____ // optional() ??
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints (Optional Call + Nullish)
- ?.() calls method only if it exists; ?? provides fallback for undefined result.
- ChatGPT: Create puzzles combining optional call with nullish coalescing.
*/
