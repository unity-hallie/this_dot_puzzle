import type { Puzzle } from '../../puzzleUtils'

export default {
  id: "types-1",
  title: "Interface",
  language: 'typescript',
  hidden_vars: [{
    hint: "the answer",
    vars: {
      ANSWER: 42
    }
  }],
  code: `
interface State { num: number } // @locked
let state: State = { num: 0 } // @locked
this = state // @locked
this.num = 21
this.num *= 2
this.num === ANSWER // @test this.num === _____ // the answer
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints (TypeScript)
- You can require typed constructs via @mandatory lines.
- ChatGPT: Ask user for topic/difficulty, then output TS modules that follow these markers exactly and include \`language: 'typescript'\`.
*/
