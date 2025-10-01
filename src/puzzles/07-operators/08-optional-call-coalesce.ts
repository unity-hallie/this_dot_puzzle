import type { Puzzle } from '../../puzzleUtils'

/*
Puzzle DSL and Prompt Hints (Weird Operators — Optional Call + ??)
- Safe optional method call with a nullish fallback.
- ChatGPT: Confirm topics; emit small puzzles combining operators with a single @test.
*/

export default {
  id: 'ops-8',
  title: 'Call If You Can',
  clue: 'optional() ??',
  code: `
const api = {} // @locked
let mode // @locked
mode = api.getMode?.() ?? 'auto'
mode === 'auto' // @test mode === '____' // optional() ??
  `.trim()
} satisfies Puzzle

