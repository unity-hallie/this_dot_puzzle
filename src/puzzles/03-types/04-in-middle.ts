import type { Puzzle } from '../../puzzleUtils'

export default {
  id: 'types-4',
  title: 'Shape Matters',
  clue: 'inside the box',
  language: 'typescript',
  code: `
interface Box { value: number } // @locked
const x: Box = { value: 0 } // @mandatory
x.value += 9 // @mandatory
x.value === 9 // @test x.value === ____ // inside the box
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints (TypeScript, middle insertion)
- Learner inserts lines between locked lines; keep a single @test.
- ChatGPT: Confirm target topics; emit new TS modules with minimal lines and clear tests.
*/
