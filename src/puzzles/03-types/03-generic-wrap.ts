import type { Puzzle } from '../../puzzleUtils'

export default {
  id: 'types-3',
  title: 'Keep The Type',
  clue: 'louder',
  language: 'typescript',
  code: `
function wrap<T>(v: T) { return { value: v } } // @locked
const x = wrap('hi') // @locked
x.value.toUpperCase() === 'HI' // @test x.value.toUpperCase() === '____' // louder
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints (TypeScript)
- Demonstrate generics, narrowing, or utility types in small steps.
- ChatGPT: Ask for topic/difficulty; output new TS puzzles using these markers and module shape.
*/
