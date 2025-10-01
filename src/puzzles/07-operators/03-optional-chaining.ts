import type { Puzzle } from '../../puzzleUtils'

export default {
  id: 'ops-3',
  title: 'Ask Politely',
  legacy: true,
  hidden_vars: [{
    hint: "optional?",
    vars: {
      NAME_OR_UNDEFINED: undefined
    }
  }],
  code: `
const user = {} // @locked
let name // @locked
name = user.profile?.name
name === NAME_OR_UNDEFINED // @test name === _____ // optional?
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints (Optional Chaining)
- \`?.\` short-circuits to undefined if property doesn't exist.
- ChatGPT: Generate puzzles showing safe property access with ?. operator.
*/
