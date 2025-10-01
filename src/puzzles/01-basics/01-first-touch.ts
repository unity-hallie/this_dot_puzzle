import type { Puzzle } from '../../puzzleUtils'

export default {
  id: "basics-1",
  title: "First Touch",
  difficulty: 1,
  teaches: ["this-binding", "property-assignment"],
  learning_notes: "Can't fail - builds confidence, introduces this.value pattern",
  hidden_vars: [{
    hint: "a baker's dozen",
    vars: {
      TARGET: 13
    }
  }],
  code: `
let obj = { value: 0 } // @locked
this = obj // @locked
this.value = 13
this.value === TARGET // @test this.value === _____ // a baker's dozen
  `.trim()
} satisfies Puzzle
/*
Puzzle DSL and Prompt Hints
- Markers: \`// @locked\`, \`// @mandatory\`, \`// @test <expr> // <display>\`.
- One concept per puzzle; keep it simple and confidence-building.
- This is the very first puzzle - make success easy and obvious.
*/
