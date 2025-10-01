import type { Puzzle } from '../../puzzleUtils'

export default {
  id: "basics-2",
  title: "Two Steps",
  difficulty: 1,
  teaches: ["code-sequencing"],
  requires: ["this-binding"],
  learning_notes: "Both lines needed; order matters but only one order works naturally",
  hidden_vars: [{
    hint: "a baker's dozen",
    vars: {
      TARGET: 13
    }
  }],
  code: `
let obj = { value: 0 } // @locked
this = obj // @locked
this.value = 8
this.value = 13
this.value === TARGET // @test this.value === _____ // a baker's dozen
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints
- Two lines, both mandatory; teaches that later assignments override earlier ones.
- Natural feedback: if they put 13 first, they get 8 and realize "last one wins".
*/
