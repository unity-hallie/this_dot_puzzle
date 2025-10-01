import type { Puzzle } from '../../puzzleUtils'

/*
Puzzle DSL and Prompt Hints (Weird Operators — Combined)
- Combine optional chaining, nullish coalescing, and ternary.
- ChatGPT: After confirming target topics, produce puzzles with small, clear goals.
*/

export default {
  id: 'ops-4',
  title: 'Fallback Strategy',
  clue: 'chain choices',
  code: `
const cfg = { debug: true } // @locked
let mode // @locked
mode = cfg.options?.mode ?? (cfg.debug ? 'debug' : 'prod')
mode === 'debug' // @test mode === '_____'
  `.trim()
} satisfies Puzzle

