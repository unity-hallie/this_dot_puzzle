import type { Puzzle } from '../../puzzleUtils'

export default {
  id: 'ops-2',
  title: 'Fallback Only When Empty',
  legacy: true,
  hidden_vars: [{
    hint: "nullish ??",
    vars: {
      FINAL_VALUE: 42
    }
  }],
  code: `
let input = null // @locked
let value // @locked
value = input ?? 42
value === FINAL_VALUE // @test value === _____ // nullish ??
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints (Nullish Coalescing)
- \`??\` operator provides fallback only for null/undefined, not all falsy values.
- ChatGPT: Create puzzles demonstrating ?? vs || behavior.
*/
