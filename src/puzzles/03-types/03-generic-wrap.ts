import type { Puzzle } from '../../puzzleUtils'

export default {
  id: 'types-3',
  title: 'Keep The Type',
  language: 'typescript',
  hidden_vars: [{
    hint: "louder",
    vars: {
      UPPERCASE_TEXT: 'HI'
    }
  }],
  code: `
function wrap<T>(v: T) { return { value: v } } // @locked
const x = wrap('hi') // @locked
x.value.toUpperCase() === UPPERCASE_TEXT // @test x.value.toUpperCase() === _____ // louder
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints (TypeScript Generics)
- Generics preserve inner type so methods remain available.
- ChatGPT: Create puzzles demonstrating type preservation through generic wrappers.
*/
