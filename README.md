This Puzzle App — Developer Guide

Overview
- A small React + TypeScript app for learning JavaScript/TypeScript via “puzzles”.
- Puzzles are short code snippets with inline markers that define which lines are locked, which are mandatory, and how to test the solution.
- You can author new puzzles quickly, or even ask an LLM (e.g., ChatGPT) to generate more given the examples and prompt notes below.

Run and Build
- Dev: `npm run dev`
- Unit tests: `npm run test:safe`
- Lint: `npm run lint`
- Build: `npm run build`
- Preview: `npm run preview`

Note on tests
- For now, only basic unit tests are enabled and passing. Broader validation and e2e are scaffolded but optional to run.
  - Basic unit tests live in `src/puzzleUtils.test.ts`.
  - Playwright e2e is set up under `e2e/` with `playwright.config.ts` (run locally with `npx playwright install` then `npm run test:e2e`).

Puzzle Format (Markers)
- `// @locked`: line is fixed and cannot be moved/edited by the learner.
- `// @mandatory`: a line must appear in the solution (use to steer intent).
- `// @test <expression> // <display>`: truthy expression evaluated after the learner’s code runs; display text is shown to the learner as the “goal”.
- Puzzles are defined in `src/puzzles/**` as modules exporting `{ id, title, clue, code, language? }`.

Example
```
export default {
  id: 'basics-1',
  title: 'First Value',
  clue: "a baker's dozen",
  code: `
let obj = { value: 0 } // @locked
this = obj // @locked
this.value = 10
this.value += 3
this.value === 13 // @test this.value === _____ // a baker's dozen
  `.trim()
}
```

Authoring Guidance
- One concept per puzzle; 2–5 learner lines.
- Use `@mandatory` to encourage specific constructs (e.g., `=>`, `map`, `const x: Type = …`).
- Tests should validate intent and avoid ambiguity.
- Prefer short and readable lines over clever one-liners.

Prompting ChatGPT to Generate Puzzles
- Each puzzle file includes a top-of-file comment block with a compact “prompt” and the DSL rules it uses. If you paste the entire file (or a few puzzle files) into ChatGPT, it will:
  - Infer the format and ask what topics and difficulty you want.
  - Generate new puzzle modules that follow the same markers and structure.
  - Produce minimal, focused challenges (2–5 lines) with a single clear test.

Suggested Chat Prompt (already embedded in puzzle headers)
- “You are generating short programming puzzles in this DSL (see markers: @locked, @mandatory, @test). Ask me first which topics (e.g., closures, arrow functions, weird JS, TypeScript generics) and difficulty I want. Then output 3–5 new puzzles as TypeScript modules that export a default object with `id`, `title`, `clue`, `code`, and optional `language: 'typescript'`. Keep the code minimal and make sure each has exactly one `@test` line with a clear learner-facing display.”

Progress Tracking
- The app stores local completion progress in `localStorage` under `this_puzzle_progress_v1`.
- The main menu shows `completed/total` per level; each puzzle card shows a ✓ when completed.

Extending the Engine
- `src/exec.ts` runs the puzzle code and test safely with a controlled `thisContext`.
- `src/puzzleUtils.ts` includes helpers for parsing puzzles and maintaining locked-line order.
- To add async puzzles, we can extend the executor to support async tests/audio gating.

Contributing
- Keep puzzles small; one idea per puzzle.
- Add new levels under `src/puzzles/<nn-topic>/` and import them in `src/puzzles/index.ts`.

