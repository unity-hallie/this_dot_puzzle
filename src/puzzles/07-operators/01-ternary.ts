import type { Puzzle } from '../../puzzleUtils'

/*
Puzzle DSL and Prompt Hints (Weird Operators — Ternary)
- Use @locked for setup; provide one or two available lines to assemble.
- Focus: conditional (?:) selection; keep it minimal and clear.
- ChatGPT: Ask the user for topics/difficulty, then emit more puzzles using the same markers and module shape.
*/

export default {
  id: 'ops-1',
  title: 'Either Or',
  legacy: true,
  hidden_vars: [{
    hint: "choose with ?",
    vars: {
      CHOSEN_LABEL: 'high'
    }
  }],
  code: `
let n = 7 // @locked
let label // @locked
label = n > 5 ? 'high' : 'low'
label === CHOSEN_LABEL // @test label === _____ // choose with ?
  `.trim()
} satisfies Puzzle
