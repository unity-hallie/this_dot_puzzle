import type { Puzzle } from '../../puzzleUtils'

export default {
  id: "basics-5",
  title: "More Operators",
  difficulty: 3,
  teaches: ["compound-assignment-multiply", "operator-types"],
  requires: ["compound-assignment-add"],
  learning_notes: "Introduces *=; first puzzle with informative wrong choice",
  hidden_vars: [{
    hint: "two weeks",
    vars: {
      TARGET: 14
    }
  }],
  code: `
let obj = { value: 0 } // @locked
this = obj // @locked
this.value = 7
this.value += 7
this.value *= 2
this.value *= 3
this.value === TARGET // @test this.value === _____ // two weeks
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints - Distractor Philosophy
- Include distractors when wrong answer teaches something specific.
- Here: \`*= 3\` gives 21 (close to 14), teaching "different operators give different results".
- Miyamoto principle: failure should be clear, informative, and recoverable.
- DON'T include random "gotcha" lines or confusing syntax.
*/
