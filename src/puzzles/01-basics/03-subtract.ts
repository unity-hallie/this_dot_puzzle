export default {
  id: "basics-3",
  title: "Subtract",
  clue: "score!",
  code: `
let data = { score: 0 } // @locked
this = data // @locked
this.score = 25
this.score -= 5
this.score === 20 // @test this.score === _____ // score!
  `.trim()
}
/*
Puzzle DSL and Prompt Hints
- Use @locked for setup, @mandatory to steer intent, and a single @test.
- Keep learner changes to 2–5 lines.
- ChatGPT: After confirming topics/difficulty, provide new modules in this exact shape.
*/
