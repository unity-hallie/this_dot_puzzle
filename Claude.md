# Claude.md - this.puzzle

## Project Overview

**this.puzzle** is an interactive educational game built with React + TypeScript + Vite that teaches JavaScript and TypeScript concepts through code puzzles. Players rearrange code lines (via drag-and-drop or text editing) to solve challenges focused on `this` context, closures, TypeScript types, and JavaScript quirks.

## Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript
- **Build**: Vite 7
- **Testing**: Vitest (unit) + Playwright (e2e)
- **Linting**: ESLint + Prettier
- **Engine**: Node >=18.18

### Core Mechanics
The game uses a custom DSL with special markers in code:
- `// @locked` - Line is fixed and cannot be edited/moved
- `// @mandatory` - Line must appear in solution
- `// @test <expression> // <display>` - Test assertion with learner-facing message

Code execution happens in a sandboxed `thisContext` object, with `this` references transformed to `thisContext` at runtime.

## Key Files & Structure

```
src/
├── App.tsx                 # Main UI with menu, level select, and puzzle views
├── puzzleUtils.ts          # Puzzle parsing, `this` replacement, locked-line ordering
├── exec.ts                 # Safe code execution engine with inline @test support
├── puzzleValidation.ts     # Puzzle validation scaffolding
├── puzzles/
│   ├── index.ts           # Level definitions (7 levels, 27 puzzles)
│   ├── 01-basics/         # `this` basics
│   ├── 02-context/        # Context switching
│   ├── 03-types/          # TypeScript (interfaces, generics)
│   ├── 04-closures/       # Closures
│   ├── 05-arrows/         # Arrow functions
│   ├── 06-weird-js/       # JavaScript edge cases
│   └── 07-operators/      # Ternary, nullish, optional chaining
├── test/
│   └── setup.ts           # Vitest setup
└── main.tsx               # App entry point

e2e/                       # Playwright tests
scripts/
└── convert-tests.mjs      # Migration tool for @assert migration (planned)
```

## Development Workflows

### Running the App
```bash
npm run dev              # Dev server (Vite)
npm run build            # Production build
npm run preview          # Preview build locally
```

### Testing
```bash
npm run test:safe        # Unit tests (single-threaded)
npm run test:cov         # Unit tests with coverage
npm run test:e2e         # Playwright e2e tests
npm run test:e2e:ui      # Playwright UI mode
```

### Linting
```bash
npm run lint             # ESLint check
npm run lint:fix         # Auto-fix issues
```

## Puzzle System Details

### Puzzle Format
Each puzzle is a TypeScript module exporting:
```typescript
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
  `.trim(),
  language?: 'typescript' // optional
}
```

### Execution Flow (`src/exec.ts`)
1. User solution lines are joined
2. TypeScript is transpiled (if `language: 'typescript'`)
3. `this` → `thisContext` replacement
4. Inline `@test` lines are transformed to `__assert(expr, message)` calls
5. Code runs in a `new Function()` with `thisContext` as the closure variable
6. Results are validated and shown to user

### UI Modes
- **Puzzle Mode**: Drag-and-drop UI with "available" and "solution" columns
- **Code Mode**: Text editor with syntax highlighting for locked/mandatory/test lines

### Progress Tracking
- Stored in `localStorage` under `this_puzzle_progress_v1`
- Tracks completion per puzzle ID
- Shown as "completed/total" badges on menu and level views

## Extending the Game

### Adding New Puzzles
1. Create a new `.ts` file in appropriate level folder (e.g., `src/puzzles/01-basics/04-new-puzzle.ts`)
2. Export default puzzle object with markers
3. Import and add to `LEVELS` array in `src/puzzles/index.ts`

### Adding New Levels
1. Create folder `src/puzzles/NN-topic/`
2. Add puzzle files
3. Define new level in `src/puzzles/index.ts`:
```typescript
{
  id: '08-async',
  title: 'Async',
  description: 'Promises and async/await',
  puzzles: [async01, async02]
}
```

### Prompting LLMs to Generate Puzzles
Each puzzle file includes a comment block with DSL rules. Paste entire puzzle file(s) to ChatGPT/Claude and request:
> "Generate 3-5 new puzzles for [topic] at [difficulty]. Follow the DSL markers and structure."

## Test Strategy

### Unit Tests (`src/puzzleUtils.test.ts`, `src/exec.test.ts`)
- Puzzle parsing
- Locked-line ordering
- `this` replacement
- Code execution edge cases
- Inline `@test` transformation

Coverage tracked via Vitest with `v8` provider.

### E2E Tests (`e2e/`)
- Scaffolded with Playwright
- Run with `npx playwright install && npm run test:e2e`
- Currently basic; can be expanded for full user flows

## Known Patterns & Conventions

### Code Style
- ESLint rules for React hooks, TypeScript
- Prettier for formatting (2-space indent, single quotes)
- `npm run lint:fix` before commits

### React Patterns
- Functional components + hooks
- State lifted to `App.tsx`
- View transitions with fade effect (`isTransitioning`)
- Drag-and-drop with native HTML5 API

### Testing Patterns
- Single-threaded test execution for safety (`--poolOptions.threads.singleThread=true`)
- Coverage config in `vitest.config.ts`
- Test files use `.test.ts` suffix

## Recent Changes (v0.1.0)
- Added inline `@test` support (executor transforms to asserts)
- Coverage tooling with Vitest
- Playwright e2e scaffolding
- ESLint + Prettier setup
- New puzzle levels: Closures, Arrows, Weird JS, Weird Operators
- Safer code execution (controlled `thisContext`)
- DnD fixes and validation scaffolding
- Progress tracking

## Future Considerations
- Async puzzle support (extend executor for `async` tests)
- Migration from `@test` to `@assert` (see `scripts/convert-tests.mjs`)
- Expanded e2e coverage
- Audio/visual gating for puzzle unlocks
- Community puzzle submissions

## Repository Structure
- Main branch: `main`
- Git hooks: None currently
- Pre-commit hooks: Not enforced (no `--no-verify` needed)

## Development Tips
- Use `npm run dev` for hot-reload development
- Run `npm run test:safe` before commits
- Keep puzzles minimal (2-5 learner lines, one concept)
- Use `@mandatory` to guide learners toward specific constructs
- Test expressions should be unambiguous
- Prefer `@test` inline assertions for new puzzles
