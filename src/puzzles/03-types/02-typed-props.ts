import type { Puzzle } from '../../puzzleUtils'

export default {
  id: 'types-2',
  title: 'Typed Props',
  language: 'typescript',
  hidden_vars: [{
    hint: "perfect square",
    vars: {
      EXPECTED_COUNT: 64
    }
  }],
  code: `
interface Data { count: number; name: string } // @locked
let obj: Data = { count: 0, name: "puzzle" } // @locked
this = obj // @locked
this.count = 8
this.count *= 8
this.count === EXPECTED_COUNT // @test this.count === _____ // perfect square
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints (TypeScript Props)
- Interfaces with multiple properties; operations on specific fields.
- ChatGPT: Generate TS puzzles with typed shapes and focused property manipulation.
*/
