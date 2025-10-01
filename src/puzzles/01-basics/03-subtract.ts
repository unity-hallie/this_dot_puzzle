import type { Puzzle } from '../../puzzleUtils'

export default {
  id: "basics-3",
  title: "Subtract",
  hidden_vars: [{
    hint: "score!",
    vars: {
      TARGET: 20
    }
  }],
  code: `
let data = { score: 0 } // @locked
this = data // @locked
this.score = 25
this.score -= 5
this.score === TARGET // @test this.score === _____ // score!
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints
- Use @locked for setup, @mandatory to steer intent, and a single @test.
- Keep learner changes to 2–5 lines.
- ChatGPT: After confirming topics/difficulty, provide new modules in this exact shape.
*/
