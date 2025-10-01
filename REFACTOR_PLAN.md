# Refactor Plan: Test Line Behavior & Legacy Marking

## Issues to Fix (Priority Order)

### 1. Test line behavior (HIGH PRIORITY)
- [x] Understand current behavior
- [ ] Write regression tests for current @test line behavior
- [ ] **BUG**: Test should be mandatory/auto-populated in solution
- [ ] **BUG**: Can't pass without test line present
- [ ] **BUG**: Test line shouldn't pass independently (scope issue)

### 2. Loose coupling pass (BEFORE structural changes)
- [ ] Identify tightly coupled code between exec.ts, puzzleUtils.ts, App.tsx
- [ ] Write comprehensive integration tests
- [ ] Extract testLine logic into separate module with tests
- [ ] Extract hidden_vars injection logic with tests
- [ ] Refactor puzzle parsing with full coverage

### 3. Mark legacy content in UI
- [ ] Add `legacy?: boolean` flag to Puzzle/Level interfaces
- [ ] Mark old Context/Types/Closures/Arrows/Weird/Operators levels as legacy
- [ ] Add UI badge for legacy puzzles
- [ ] Add UI badge for legacy levels

## Current Understanding

**Test line behavior (from code review):**
- `@test` lines exposed as available items via `parsePuzzleCode()` line 41
- Puzzles can pass WITHOUT test line (only checks `asserts > 0` in exec.ts)
- If no inline tests, falls back to legacy `testLine` parameter

**Architecture issues:**
- parsePuzzleCode returns test as available line (should be locked?)
- executePuzzle doesn't require test line presence
- Test scope: runs in same scope as solution (good) but optional (bad)

## Investigation Steps

1. Write test reproducing "passes without test line" bug
2. Write test for "test line must be in solution to pass"
3. Fix test line parsing to mark as mandatory/locked
4. Add validation that puzzle must have test to pass
5. Write regression suite before refactoring
