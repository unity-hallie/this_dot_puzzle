export default {
  id: "context-2",
  title: "Juggle",
  clue: "half a hundred",
  code: `
let x = { n: 10 } // @locked
let y = { n: 20 } // @locked
let z = { n: 30 } // @locked
this = x // @locked
this.n += 5
this = y
this.n += 10
this = z
this.n += 20
this.n === 50 // @test this.n === _____ // half a hundred
  `.trim()
}
/*
Puzzle DSL and Prompt Hints
- Keep tests clear and learner-facing.
- ChatGPT: Confirm target (closures, arrows, weird JS, TS) then output more puzzles with these same markers.
*/
