import type { Puzzle } from '../../puzzleUtils'

export default {
  id: 'weird-1',
  title: 'Zero, But Which?',
  clue: 'spot the imposter',
  code: `
const res = Object.is(-0, 0)
res === false // @test res === _____ // spot the imposter
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints (Weird JS)
- Explore JS edge cases like -0, NaN, coercion, descriptors, etc.
- ChatGPT: Ask for topics/difficulty; output puzzle modules using the same markers.
*/
