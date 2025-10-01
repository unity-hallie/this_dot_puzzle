import type { Puzzle } from '../../puzzleUtils'

export default {
  id: 'weird-2',
  title: 'Truth Be Told',
  clue: 'empty but truthy',
  code: `
const a = [] // @locked
const b = !a // @mandatory
b === false // @test b === ____ // empty but truthy
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints (Weird JS)
- Focus on truthiness, equality quirks, and corner cases.
- ChatGPT: Ask for preferences; generate more modules with the same DSL and structure.
*/
