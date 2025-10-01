export default {
  id: "context-1",
  title: "Context Switch",
  clue: "days in a leap year",
  code: `
let a = { val: 0 } // @locked
let b = { val: 200 } // @locked
this = a // @locked
this.val = 100
this = b // @mandatory
this.val += 166
this.val === 366 // @test this.val === _____ // days in a leap year
  `.trim()
}
/*
Puzzle DSL and Prompt Hints
- Showcase context switching with minimal code.
- ChatGPT: Ask which topics; then generate puzzles using the same markers and module shape.
*/
