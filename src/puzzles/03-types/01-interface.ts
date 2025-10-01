export default {
  id: "types-1",
  title: "Interface",
  clue: "the answer",
  language: 'typescript',
  code: `
interface State { num: number } // @locked
let state: State = { num: 0 } // @locked
this = state // @locked
this.num = 21
this.num *= 2
this.num === 42 // @test this.num === _____ // the answer
  `.trim()
}
/*
Puzzle DSL and Prompt Hints (TypeScript)
- You can require typed constructs via @mandatory lines.
- ChatGPT: Ask user for topic/difficulty, then output TS modules that follow these markers exactly and include `language: 'typescript'`.
*/
