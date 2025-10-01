import type { Puzzle } from '../../puzzleUtils'

/*
Puzzle DSL and Prompt Hints (Weird Operators — Nested Ternary)
- Small categorization with nested ternary; single clear expected label.
- ChatGPT: Ask for complexity; keep lines minimal and readable.
*/

export default {
  id: 'ops-7',
  title: 'Tiered Choice',
  clue: 'med label',
  code: `
const n = 7 // @locked
let label // @locked
label = n > 10 ? 'big' : (n > 5 ? 'med' : 'small')
label === 'med' // @test label === '____' // med label
  `.trim()
} satisfies Puzzle

