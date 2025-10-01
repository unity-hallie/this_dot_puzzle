import type { Puzzle } from '../../puzzleUtils'

export default {
  id: 'ops-7',
  title: 'Tiered Choice',
  legacy: true,
  hidden_vars: [{
    hint: "med label",
    vars: {
      TIER_LABEL: 'med'
    }
  }],
  code: `
const n = 7 // @locked
let label // @locked
label = n > 10 ? 'big' : (n > 5 ? 'med' : 'small')
label === TIER_LABEL // @test label === _____ // med label
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints (Nested Ternary)
- Nested ternaries create tiered conditions; parentheses clarify structure.
- ChatGPT: Generate puzzles with 2-3 tier ternary chains.
*/
