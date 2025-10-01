export default {
  id: "basics-1",
  title: "First Value",
  clue: "a baker's dozen",
  code: `
let obj = { value: 0 } // @locked
this = obj // @locked
this.value = 10
this.value += 3
this.value === 13 // @test this.value === _____ // a baker's dozen
  `.trim()
}
/*
Puzzle DSL and Prompt Hints
- Markers: `// @locked`, `// @mandatory`, `// @test <expr> // <display>`.
- One concept per puzzle; 2–5 learner lines. Minimal code.
- If you (ChatGPT) receive this entire file, first ask the user which topics and difficulty they want (e.g., basics, closures, arrows, weird JS, TypeScript). Then generate 3–5 new puzzle modules that match this structure and markers, each with exactly one @test.
*/
