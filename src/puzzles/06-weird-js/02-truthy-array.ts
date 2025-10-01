import type { Puzzle } from '../../puzzleUtils'

export default {
  id: 'weird-2',
  title: 'Truth Be Told',
  legacy: true,
  hidden_vars: [{
    hint: "empty but truthy",
    vars: {
      NEGATED_EMPTY_ARRAY: false
    }
  }],
  code: `
const a = [] // @locked
const b = !a // @mandatory
b === NEGATED_EMPTY_ARRAY // @test b === _____ // empty but truthy
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints (Weird JS — Truthiness)
- Empty arrays/objects are truthy; negation converts to boolean.
- ChatGPT: Generate puzzles exploring JS truthy/falsy edge cases.
*/
