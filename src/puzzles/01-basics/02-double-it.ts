export default {
  id: "basics-2",
  title: "Double It",
  clue: "the answer to everything",
  code: `
let state = { x: 0 } // @locked
this = state // @locked
this.x = 21
this.x *= 2
this.x === 42 // @test this.x === _____ // the answer to everything
  `.trim()
}
/*
Puzzle DSL and Prompt Hints
- Markers: `// @locked`, `// @mandatory`, `// @test <expr> // <display>`.
- Prefer small, focused challenges with a single clear goal.
- ChatGPT: Ask the user what topics/difficulty to target, then output new puzzles matching this format as TypeScript modules.
*/
