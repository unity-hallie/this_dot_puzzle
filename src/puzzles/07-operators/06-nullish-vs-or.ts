import type { Puzzle } from '../../puzzleUtils'

/*
Puzzle DSL and Prompt Hints (Weird Operators — ?? vs ||)
- Show that `||` treats 0/'' as falsy, while `??` preserves them.
- ChatGPT: Confirm topics; emit similar modules with this DSL and structure.
*/

export default {
  id: 'ops-6',
  title: 'Zero Is Legit',
  clue: '?? keeps 0',
  code: `
const input = 0 // @locked
let out // @locked
out = input ?? 10
out === 0 // @test out === _ // ?? keeps 0
  `.trim()
} satisfies Puzzle

