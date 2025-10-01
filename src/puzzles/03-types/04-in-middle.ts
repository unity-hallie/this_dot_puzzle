import type { Puzzle } from '../../puzzleUtils'

export default {
  id: 'types-4',
  title: 'Shape Matters',
  language: 'typescript',
  hidden_vars: [{
    hint: "inside the box",
    vars: {
      EXPECTED_VALUE: 9
    }
  }],
  code: `
interface Box { value: number } // @locked
const x: Box = { value: 0 } // @mandatory
x.value += 9 // @mandatory
x.value === EXPECTED_VALUE // @test x.value === _____ // inside the box
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints (TypeScript Generic Interfaces)
- Generic interfaces with constrained operations on the wrapped type.
- ChatGPT: Emit puzzles using generic interfaces and type-safe property access.
*/
