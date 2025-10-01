import type { Puzzle } from '../../puzzleUtils'

export default {
  id: 'ops-6',
  title: 'Zero Is Legit',
  legacy: true,
  hidden_vars: [{
    hint: "?? keeps 0",
    vars: {
      FINAL_OUTPUT: 0
    }
  }],
  code: `
const input = 0 // @locked
let out // @locked
out = input ?? 10
out === FINAL_OUTPUT // @test out === _____ // ?? keeps 0
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints (Nullish vs OR)
- Key difference: ?? treats 0, '', false as valid; || treats them as falsy.
- ChatGPT: Create puzzles contrasting ?? with || behavior on falsy-but-valid values.
*/
