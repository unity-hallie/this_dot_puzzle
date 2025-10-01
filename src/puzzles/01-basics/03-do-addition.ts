import type { Puzzle } from '../../puzzleUtils'

export default {
  id: "basics-3",
  title: "Do Addition",
  difficulty: 2,
  teaches: ["arithmetic-operations"],
  requires: ["code-sequencing"],
  learning_notes: "Explicit x = x + y form; introduces calculation concept",
  hidden_vars: [{
    hint: "a baker's dozen",
    vars: {
      TARGET: 13
    }
  }],
  code: `
let obj = { value: 0 } // @locked
this = obj // @locked
this.value = 5
this.value = this.value + 8
this.value === TARGET // @test this.value === _____ // a baker's dozen
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints
- No distractors yet; just learning that you can do math.
- \`this.value + 8\` is clear and explicit.
*/
