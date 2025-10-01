import type { Puzzle } from '../../puzzleUtils'

export default {
  id: "context-1",
  title: "Context Switch",
  hidden_vars: [{
    hint: "days in a leap year",
    vars: {
      LEAP_YEAR_DAYS: 366
    }
  }],
  code: `
let a = { val: 0 } // @locked
let b = { val: 200 } // @locked
this = a // @locked
this.val = 100
this = b // @mandatory
this.val += 166
this.val === LEAP_YEAR_DAYS // @test this.val === _____ // days in a leap year
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints (Context)
- Focus: context switching via \`this =\` reassignment.
- ChatGPT: Emit puzzles that switch contexts and require tracking which object is active.
*/
