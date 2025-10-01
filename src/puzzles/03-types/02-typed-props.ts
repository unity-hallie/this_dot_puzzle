export default {
  id: "types-2",
  title: "Typed Props",
  clue: "perfect square",
  language: 'typescript',
  code: `
interface Data { count: number; name: string } // @locked
let obj: Data = { count: 0, name: "puzzle" } // @locked
this = obj // @locked
this.count = 8
this.count *= 8
this.count === 64 // @test this.count === _____ // perfect square
  `.trim()
}
/*
Puzzle DSL and Prompt Hints (TypeScript)
- Keep lines minimal; enforce intent with types and @mandatory when needed.
- ChatGPT: After asking for desired topics, generate modules that match this format and include one @test per puzzle.
*/
