import type { Puzzle } from '../../puzzleUtils'

export default {
  id: 'ops-4',
  title: 'Fallback Strategy',
  hidden_vars: [{
    hint: "chain choices",
    vars: {
      RUNTIME_MODE: 'debug'
    }
  }],
  code: `
const cfg = { debug: true } // @locked
let mode // @locked
mode = cfg.options?.mode ?? (cfg.debug ? 'debug' : 'prod')
mode === RUNTIME_MODE // @test mode === _____ // chain choices
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints (Combined Operators)
- Combine ?., ??, and ternary for complex fallback logic.
- ChatGPT: Create puzzles with multiple operator types working together.
*/
