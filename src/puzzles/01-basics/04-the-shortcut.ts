import type { Puzzle } from '../../puzzleUtils'

export default {
  id: "basics-4",
  title: "The Shortcut",
  difficulty: 2,
  teaches: ["compound-assignment-add"],
  requires: ["arithmetic-operations"],
  learning_notes: "Both solutions work! Teaches += is equivalent to x = x + y",
  hidden_vars: [{
    hint: "a baker's dozen",
    vars: {
      TARGET: 13
    }
  }],
  code: `
let obj = { value: 0 } // @locked
this = obj // @locked
this.value = 10
this.value = this.value + 3
this.value += 3
this.value === TARGET // @test this.value === _____ // a baker's dozen
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints
- BOTH available lines work! Not a trap - reveals equivalence.
- Player discovers \`+=\` is a shorthand for \`x = x + y\`.
- Miyamoto principle: success teaches as much as failure.
*/
