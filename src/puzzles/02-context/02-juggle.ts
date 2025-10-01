import type { Puzzle } from '../../puzzleUtils'

export default {
  id: "context-2",
  title: "Juggle",
  hidden_vars: [{
    hint: "half a hundred",
    vars: {
      HALF_HUNDRED: 50
    }
  }],
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
this.n === HALF_HUNDRED // @test this.n === _____ // half a hundred
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints (Context Juggling)
- Multiple \`this =\` switches; track which context receives each change.
- ChatGPT: Create puzzles with 3+ context switches requiring careful tracking.
*/
