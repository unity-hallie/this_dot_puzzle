import type { Puzzle } from '../../puzzleUtils'

/*
Puzzle DSL and Prompt Hints (Weird Operators — Nullish Coalescing)
- Demonstrate that ?? only falls back for null/undefined, not falsy values like 0 or ''.
- ChatGPT: Confirm topics/difficulty; output similar modules with these markers.
*/

export default {
  id: 'ops-2',
  title: 'Fallback Only When Empty',
  clue: 'nullish ??',
  code: `
let input = null // @locked
let value // @locked
value = input ?? 42
value === 42 // @test value === ____ // nullish ??
  `.trim()
} satisfies Puzzle

