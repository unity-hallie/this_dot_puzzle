import type { Puzzle } from '../../puzzleUtils'

/*
Puzzle DSL and Prompt Hints (Weird Operators — Optional Chaining)
- Access deep properties safely; result can be undefined.
- ChatGPT: Ask about scope/difficulty; generate modules using the same DSL and structure.
*/

export default {
  id: 'ops-3',
  title: 'Ask Politely',
  clue: 'optional?',
  code: `
const user = {} // @locked
let name // @locked
name = user.profile?.name
name === undefined // @test name === _________ // optional?
  `.trim()
} satisfies Puzzle

