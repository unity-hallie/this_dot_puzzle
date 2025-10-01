import type { Puzzle } from '../../puzzleUtils'

export default {
  id: "basics-6",
  title: "The Plan",
  difficulty: 4,
  teaches: ["multi-step-planning", "operation-order"],
  requires: ["compound-assignment-multiply"],
  learning_notes: "Order matters: (5+5)*2=20 vs including +10 gives 30. Key assessment puzzle.",
  hidden_vars: [{
    hint: "fingers and toes",
    vars: {
      TARGET: 20
    }
  }],
  code: `
let obj = { value: 0 } // @locked
this = obj // @locked
this.value = 5
this.value += 5
this.value *= 2
this.value += 10
this.value === TARGET // @test this.value === _____ // fingers and toes
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints - Multi-step Planning
- Three mandatory lines, one optional distractor.
- The distractor (\`+= 10\`) is plausible but gives 30 instead of 20.
- Miyamoto principle: wrong answer (30) is exactly 10 more than right (20).
- When they fail, they realize: "Oh, I shouldn't have added 10!"
- This teaches planning ahead and selective use of available lines.
*/
