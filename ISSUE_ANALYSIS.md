# Issue Analysis: Test Line Behavior

## Current State (from code review)

### How `@test` lines are parsed:
```typescript
// In puzzleUtils.ts:parsePuzzleCode() line 34-41
if (line.includes('// @test')) {
  const match = line.match(/^(.+?)\s*\/\/ @test\s+(.+)$/)
  if (match) {
    testLine = match[1].trim()
    testDisplay = match[2].trim()
  }
  // Expose test line as an available item so it can be freely placed
  availableLines.push(line.trim())  // <-- BUG: Test is optional!
}
```

### How executor handles tests:
```typescript
// In exec.ts:executePuzzle()
const { code: withAsserts, asserts } = transformInlineTests(raw)

if (asserts > 0) {
  // Has inline @test - runs them
} else {
  // Falls back to legacy testLine parameter
}
```

## Problems

### Problem 1: Test line is optional
**Current behavior:** Test line appears in "available" list and can be dragged or not
**Expected:** Test line should be locked/mandatory - puzzle won't work without it

**Impact:** User can arrange all code correctly but not include the test, and get confused when it doesn't validate

### Problem 2: No validation for missing test
**Current behavior:** If no test line in solution:
- `asserts === 0`
- Falls back to `testLine` parameter (which might be empty string)
- Might execute code with no validation at all

**Expected:** Should fail with clear message: "Test line is required"

### Problem 3: Test line scope (CLARIFY)
**Need to verify:** Does test line have access to variables from solution?
- Tests show it DOES work currently
- But is it reliable?

## Solutions

### Option A: Make test line locked (Recommended)
```typescript
// In parsePuzzleCode():
if (line.includes('// @test')) {
  // ... extract testLine and testDisplay ...

  // Add test as a LOCKED line at end
  lockedLines.push({
    content: line.trim(),
    type: 'locked',
    originalPosition: lines.length
  })
  // DON'T add to availableLines
}
```

**Pros:**
- Test always present in solution
- Can't be removed or reordered incorrectly
- Clear to learner what's being tested

**Cons:**
- Less flexible (but that's good for pedagogy!)

### Option B: Make test line mandatory
```typescript
// Add test to mandatoryLines instead of availableLines
if (line.includes('// @test')) {
  // ... extract ...
  mandatoryLines.push(line.trim())
}
```

**Pros:**
- Must be included
- Can be placed anywhere (flexibility)

**Cons:**
- User might put test before code runs (order matters!)
- More confusing than locked

### Option C: Default test to solution
```typescript
// In App.tsx:initializeSolution()
const initial: SolutionLine[] = [
  ...lockedLines.map(...),
  // Add test line at end if present
  ...(testLine ? [{
    content: testLine,
    isLocked: true,
    isMandatory: false
  }] : [])
]
```

**Pros:**
- Test pre-populated
- User sees it immediately

**Cons:**
- Still needs to be marked as locked to prevent removal

## Recommendation

**Use Option A + C combined:**
1. Parse test line as LOCKED (not available)
2. Auto-populate test line in solution on puzzle load
3. Add validation that fails if no test present

This matches the design intent: test line shows what we're checking for, and learner arranges code to make it pass.
