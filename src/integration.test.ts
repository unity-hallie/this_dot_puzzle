import { describe, it, expect } from 'vitest'
import { parsePuzzleCode, replaceThisReferences, transpileTypeScript, ensureLockedOrder, type SolutionLine } from './puzzleUtils'
import { executePuzzle, type ExecuteParams } from './exec'
import type { Puzzle } from './puzzleUtils'

/**
 * Integration tests covering the full puzzle execution pipeline:
 * parse → execute → validate → display result
 *
 * These tests ensure all components work together correctly
 * for real-world puzzle scenarios.
 */

describe('Integration: Full Puzzle Flow', () => {
  it('should complete full flow: parse → execute → validate with inline @test', () => {
    const puzzle: Puzzle = {
      id: 'test-1',
      title: 'Test Puzzle',
      hidden_vars: [{
        hint: 'lucky number',
        vars: { TARGET: 7 }
      }],
      code: `
let obj = { value: 0 } // @locked
this = obj // @locked
this.value = 3
this.value += 4
this.value === TARGET // @test this.value === _____ // lucky number
      `.trim()
    }

    // Step 1: Parse
    const parsed = parsePuzzleCode(puzzle.code)
    expect(parsed.lockedLines).toHaveLength(3) // 2 locked + 1 test line (locked)
    expect(parsed.availableLines).toHaveLength(2) // 2 code lines (test line is now locked)

    // Step 2: Construct solution (user drags lines)
    const solutionLines = [
      'let obj = { value: 0 }',
      'this = obj',
      'this.value = 3',
      'this.value += 4',
      'this.value === TARGET // @test this.value === _____ // lucky number'
    ]

    // Step 3: Execute
    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: [],
      clue: puzzle.hidden_vars![0].hint,
      hiddenVars: puzzle.hidden_vars![0].vars
    })

    // Step 4: Validate result
    expect(result.success).toBe(true)
    expect(result.result).toContain('✓')
    expect(result.result).toContain('lucky number')
    // thisContext is populated via this = obj replacement
  })

  it('should handle TypeScript transpilation in full flow', () => {
    const puzzle: Puzzle = {
      id: 'ts-test',
      title: 'TypeScript Test',
      language: 'typescript',
      hidden_vars: [{
        hint: 'typed value',
        vars: { TARGET: 42 }
      }],
      code: `
let obj: { value: number } = { value: 0 } // @locked
this = obj // @locked
this.value = 42
this.value === TARGET // @test this.value === TARGET // typed value
      `.trim()
    }

    const parsed = parsePuzzleCode(puzzle.code)
    const solutionLines = [
      'let obj: { value: number } = { value: 0 }',
      'this = obj',
      'this.value = 42',
      'this.value === TARGET // @test this.value === TARGET // typed value'
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: true,
      testLine: '',
      mandatoryLines: [],
      clue: 'typed value',
      hiddenVars: { TARGET: 42 }
    })

    expect(result.success).toBe(true)
    // TypeScript transpilation successful
  })

  it('should fail when solution is incorrect', () => {
    const solutionLines = [
      'let obj = { value: 0 }',
      'this = obj',
      'this.value = 3',
      'this.value += 3', // Wrong! Should be += 4
      'this.value === TARGET // @test this.value === _____ // should be 7'
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: [],
      clue: 'should be 7',
      hiddenVars: { TARGET: 7 }
    })

    expect(result.success).toBe(false)
    expect(result.result).toContain('✗')
    // Failed as expected with wrong value
  })

  it('should complete code mode flow with text editor', () => {
    const codeText = `
let obj = { value: 0 }
this = obj
this.value = 10
this.value *= 2
this.value === EXPECTED // @test this.value === EXPECTED // doubled
    `.trim()

    const result = executePuzzle({
      mode: 'code',
      codeText,
      solutionLines: [], // Not used in code mode
      isTypeScript: false,
      testLine: '',
      mandatoryLines: [],
      clue: 'doubled',
      hiddenVars: { EXPECTED: 20 }
    })

    expect(result.success).toBe(true)
    // Code mode execution successful
  })
})

describe('Integration: Hidden Variables Injection', () => {
  it('should inject hidden vars into execution scope', () => {
    const solutionLines = [
      'let result = SECRET * 2',
      'result === 10 // @test result === 10 // doubled secret'
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: [],
      clue: 'doubled secret',
      hiddenVars: { SECRET: 5 }
    })

    expect(result.success).toBe(true)
  })

  it('should support multiple hidden variables', () => {
    const solutionLines = [
      'let sum = A + B + C',
      'sum === 15 // @test sum === 15 // sum of hidden'
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: [],
      clue: 'sum of hidden',
      hiddenVars: { A: 3, B: 5, C: 7 }
    })

    expect(result.success).toBe(true)
  })

  it('should allow complex hidden variable types', () => {
    const solutionLines = [
      'let result = CONFIG.multiplier * CONFIG.base',
      'result === 50 // @test result === 50 // configured'
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: [],
      clue: 'configured',
      hiddenVars: { CONFIG: { multiplier: 5, base: 10 } }
    })

    expect(result.success).toBe(true)
  })

  it('should make hidden vars available to test line', () => {
    const solutionLines = [
      'let obj = { value: 0 }',
      'this = obj',
      'this.value = ANSWER',
      'this.value === ANSWER // @test this.value === ANSWER // the answer'
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: [],
      clue: 'the answer',
      hiddenVars: { ANSWER: 42 }
    })

    expect(result.success).toBe(true)
    // Hidden vars successfully accessed in test line
  })
})

describe('Integration: Test Line Execution with Solution Scope', () => {
  it('test line should access variables from solution', () => {
    const solutionLines = [
      'let myValue = 100',
      'myValue += 50',
      'myValue === 150 // @test myValue === 150 // sum check'
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: [],
      clue: 'sum check',
    })

    expect(result.success).toBe(true)
  })

  it('test line should access this context from solution', () => {
    const solutionLines = [
      'let obj = { count: 0 }',
      'this = obj',
      'this.count = 5',
      'this.count += 3',
      'this.count === 8 // @test this.count === 8 // counted'
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: [],
      clue: 'counted',
    })

    expect(result.success).toBe(true)
  })

  it('test line should combine solution vars and hidden vars', () => {
    const solutionLines = [
      'let computed = BASE * 3',
      'computed === BASE * 3 // @test computed === BASE * 3 // tripled'
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: [],
      clue: 'tripled',
      hiddenVars: { BASE: 7 }
    })

    expect(result.success).toBe(true)
  })
})

describe('Integration: Mandatory Lines Validation', () => {
  it('should fail when mandatory line is missing', () => {
    const solutionLines = [
      'let obj = { value: 0 }',
      'this = obj',
      'this.value = 10',
      // Missing: 'this.value *= 2' (mandatory)
      'this.value === 20 // @test this.value === 20 // check'
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: ['this.value *= 2'],
      clue: 'check',
    })

    expect(result.success).toBe(false)
    expect(result.result).toContain('missing required lines')
    expect(result.usedMandatory).toBe(false)
  })

  it('should pass when mandatory line is included', () => {
    const solutionLines = [
      'let obj = { value: 0 }',
      'this = obj',
      'this.value = 10',
      'this.value *= 2', // Mandatory line present
      'this.value === 20 // @test this.value === 20 // doubled'
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: ['this.value *= 2'],
      clue: 'doubled',
    })

    expect(result.success).toBe(true)
    expect(result.usedMandatory).toBe(true)
  })

  it('should validate multiple mandatory lines', () => {
    const solutionLines = [
      'let obj = { value: 0 }',
      'this = obj',
      'this.value = 5',
      'this.value += 5',
      'this.value *= 2',
      'this.value === 20 // @test this.value === 20 // result'
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: ['this.value += 5', 'this.value *= 2'],
      clue: 'result',
    })

    expect(result.success).toBe(true)
    expect(result.usedMandatory).toBe(true)
  })

  it('should fail if any mandatory line is missing from multiple', () => {
    const solutionLines = [
      'let obj = { value: 0 }',
      'this = obj',
      'this.value = 5',
      'this.value += 5', // First mandatory present
      // Missing: 'this.value *= 2' (second mandatory)
      'this.value === 20 // @test this.value === 20 // result'
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: ['this.value += 5', 'this.value *= 2'],
      clue: 'result',
    })

    expect(result.success).toBe(false)
    expect(result.result).toContain('missing required lines')
  })
})

describe('Integration: Legacy testLine Fallback', () => {
  it('should use legacy testLine when no inline @test present', () => {
    const solutionLines = [
      'let obj = { value: 0 }',
      'this = obj',
      'this.value = 15',
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: 'this.value === 15', // Legacy test line
      mandatoryLines: [],
      clue: 'fifteen',
    })

    expect(result.success).toBe(true)
    expect(result.result).toContain('✓')
  })

  it('should fail with legacy testLine when condition is false', () => {
    const solutionLines = [
      'let obj = { value: 0 }',
      'this = obj',
      'this.value = 10',
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: 'this.value === 15', // Will be false
      mandatoryLines: [],
      clue: 'wrong',
    })

    expect(result.success).toBe(false)
    expect(result.result).toContain('✗')
  })

  it('should respect mandatory lines with legacy testLine', () => {
    const solutionLines = [
      'let obj = { value: 0 }',
      'this = obj',
      'this.value = 10',
      // Missing mandatory line
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: 'this.value === 10',
      mandatoryLines: ['this.value += 5'],
      clue: 'test',
    })

    expect(result.success).toBe(false)
    expect(result.result).toContain('missing required lines')
  })

  it('should work with legacy testLine and hidden vars', () => {
    const solutionLines = [
      'let obj = { value: 0 }',
      'this = obj',
      'this.value = TARGET',
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: 'this.value === TARGET',
      mandatoryLines: [],
      clue: 'target hit',
      hiddenVars: { TARGET: 99 }
    })

    expect(result.success).toBe(true)
    // Legacy testLine with hidden vars works
  })
})

describe('Integration: thisContext Replacement End-to-End', () => {
  it('should replace this references throughout execution', () => {
    const solutionLines = [
      'let myObj = { x: 0, y: 0 }',
      'this = myObj',
      'this.x = 10',
      'this.y = 20',
      'this.x + this.y === 30 // @test this.x + this.y === 30 // sum'
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: [],
      clue: 'sum',
    })

    expect(result.success).toBe(true)
    // thisContext replacement successful
  })

  it('should handle this in various contexts', () => {
    const solutionLines = [
      'let obj = { value: 0, flag: false }',
      'this = obj',
      'this.value = 5',
      'this.flag = true',
      'this["value"] = 10', // Bracket notation
      'this ? 1 : 0', // Ternary
      'this.value === 10 && this.flag // @test combined check'
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: [],
      clue: 'combined check',
    })

    expect(result.success).toBe(true)
    // Various this contexts handled correctly
  })
})

describe('Integration: Multiple Test Lines', () => {
  it('should execute multiple @test lines and report first failure', () => {
    const solutionLines = [
      'let x = 5',
      'x += 3 // @test x === 8 // first check',
      'x *= 2 // @test x === 16 // second check',
      'x -= 1 // @test x === 15 // third check - will fail',
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: [],
      clue: 'test',
    })

    expect(result.success).toBe(false)
    expect(result.result).toContain('third check')
  })

  it('should pass when all test lines succeed', () => {
    const solutionLines = [
      'let n = 1',
      'n += 1 // @test n === 2 // step 1',
      'n *= 3 // @test n === 6 // step 2',
      'n -= 1 // @test n === 5 // step 3',
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: [],
      clue: 'all steps',
    })

    expect(result.success).toBe(true)
  })
})

describe('Integration: Edge Cases', () => {
  it('should handle empty solution', () => {
    const solutionLines: string[] = []

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: 'true',
      mandatoryLines: [],
      clue: 'empty',
    })

    // Should execute but may fail depending on testLine
    expect(result.success).toBe(true)
  })

  it('should handle solution with only locked lines', () => {
    const solutionLines = [
      'let obj = { value: 5 }',
      'this = obj',
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: 'this.value === 5',
      mandatoryLines: [],
      clue: 'locked only',
    })

    expect(result.success).toBe(true)
    expect(result.thisContext).toHaveProperty('value', 5)
  })

  it('should handle syntax errors gracefully', () => {
    const solutionLines = [
      'let x = {{{ invalid syntax',
      'x === 1 // @test broken'
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: [],
      clue: 'error case',
    })

    expect(result.success).toBe(false)
    expect(result.result).toContain('error:')
  })

  it('should handle test line without hidden vars', () => {
    const solutionLines = [
      'let val = 10',
      'val += 5',
      'val === 15 // @test val === 15 // plain test'
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: [],
      clue: 'plain test',
      hiddenVars: {} // No hidden vars
    })

    expect(result.success).toBe(true)
  })

  it('should handle runtime errors during execution', () => {
    const solutionLines = [
      'let obj = null',
      'obj.value = 5', // Will throw
      'true // @test should not reach'
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: [],
      clue: 'runtime error',
    })

    expect(result.success).toBe(false)
    expect(result.result).toContain('error:')
  })

  it('should handle missing test line in inline mode', () => {
    // User solution without any @test line
    const solutionLines = [
      'let x = 5',
      'x += 8',
      // No test line at all
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '', // Empty testLine, no inline tests
      mandatoryLines: [],
      clue: 'no test',
    })

    // Should fail because no test assertion is present
    expect(result.success).toBe(false)
    expect(result.result).toContain('missing test assertion')
  })
})

describe('Integration: Locked Line Ordering', () => {
  it('should maintain locked line order in solution', () => {
    const lockedContents = ['let x = 1', 'let y = 2', 'let z = 3']
    const userSolution: SolutionLine[] = [
      { content: 'let x = 1', isLocked: true, isMandatory: false },
      { content: 'this.value = 5', isLocked: false, isMandatory: false },
      { content: 'let y = 2', isLocked: true, isMandatory: false },
      { content: 'this.value += 3', isLocked: false, isMandatory: false },
      { content: 'let z = 3', isLocked: true, isMandatory: false },
    ]

    const ordered = ensureLockedOrder(userSolution, lockedContents)
    const orderedContents = ordered.map(l => l.content)

    expect(orderedContents).toEqual([
      'let x = 1',
      'this.value = 5',
      'let y = 2',
      'this.value += 3',
      'let z = 3'
    ])
  })

  it('should reorder when locked lines are out of sequence', () => {
    const lockedContents = ['let a = 1', 'let b = 2']
    const userSolution: SolutionLine[] = [
      { content: 'let b = 2', isLocked: true, isMandatory: false }, // Wrong order
      { content: 'code', isLocked: false, isMandatory: false },
      { content: 'let a = 1', isLocked: true, isMandatory: false },
    ]

    const ordered = ensureLockedOrder(userSolution, lockedContents)
    const orderedContents = ordered.map(l => l.content)

    // Should fix to correct locked order
    expect(orderedContents).toEqual([
      'let a = 1',
      'code',
      'let b = 2'
    ])
  })
})

describe('Integration: Real Puzzle Scenarios', () => {
  it('should solve basics-1 style puzzle', () => {
    const puzzle: Puzzle = {
      id: 'basics-1',
      title: 'First Touch',
      hidden_vars: [{
        hint: "a baker's dozen",
        vars: { TARGET: 13 }
      }],
      code: `
let obj = { value: 0 } // @locked
this = obj // @locked
this.value = 13
this.value === TARGET // @test this.value === _____ // a baker's dozen
      `.trim()
    }

    const parsed = parsePuzzleCode(puzzle.code)
    // Locked lines include the test line now, so we just add available lines
    const solutionLines = [
      ...parsed.lockedLines.map(l => l.content),
      'this.value = 13'
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: [],
      clue: puzzle.hidden_vars![0].hint,
      hiddenVars: puzzle.hidden_vars![0].vars
    })

    expect(result.success).toBe(true)
    expect(result.thisContext).toHaveProperty('value', 13)
  })

  it('should solve multi-step planning puzzle (basics-6 style)', () => {
    const puzzle: Puzzle = {
      id: 'basics-6',
      title: 'The Plan',
      hidden_vars: [{
        hint: 'fingers and toes',
        vars: { TARGET: 20 }
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
    }

    const parsed = parsePuzzleCode(puzzle.code)

    // Correct solution: locked lines + correct available lines (not += 10)
    const solutionLines = [
      ...parsed.lockedLines.map(l => l.content),
      'this.value = 5',
      'this.value += 5',
      'this.value *= 2'
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: [],
      clue: puzzle.hidden_vars![0].hint,
      hiddenVars: puzzle.hidden_vars![0].vars
    })

    expect(result.success).toBe(true)
    expect(result.thisContext).toHaveProperty('value', 20)
  })

  it('should fail multi-step planning puzzle with wrong line', () => {
    const solutionLines = [
      'let obj = { value: 0 }',
      'this = obj',
      'this.value = 5',
      'this.value += 5',
      'this.value *= 2',
      'this.value += 10', // Wrong! Distractor line
      'this.value === TARGET // @test this.value === _____ // fingers and toes'
    ]

    const result = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: [],
      clue: 'fingers and toes',
      hiddenVars: { TARGET: 20 }
    })

    expect(result.success).toBe(false)
    expect(result.thisContext).toHaveProperty('value', 30) // Wrong answer
  })
})

describe('Integration: TypeScript Transpilation Flow', () => {
  it('should transpile TypeScript types and execute correctly', () => {
    const code = `
interface Config {
  multiplier: number
  base: number
}
let config: Config = { multiplier: 3, base: 7 }
let result: number = config.multiplier * config.base
result === 21 // @test result === 21 // typed calc
    `.trim()

    const result = executePuzzle({
      mode: 'code',
      codeText: code,
      solutionLines: [],
      isTypeScript: true,
      testLine: '',
      mandatoryLines: [],
      clue: 'typed calc',
    })

    expect(result.success).toBe(true)
  })

  it('should handle TypeScript with generics', () => {
    const code = `
function identity<T>(x: T): T { return x }
let val: number = identity(42)
val === 42 // @test val === 42 // generic works
    `.trim()

    const result = executePuzzle({
      mode: 'code',
      codeText: code,
      solutionLines: [],
      isTypeScript: true,
      testLine: '',
      mandatoryLines: [],
      clue: 'generic works',
    })

    expect(result.success).toBe(true)
  })

  it('should transpile enums correctly', () => {
    const code = `
enum Status { Ready = 1, Running = 2, Done = 3 }
let current: Status = Status.Done
current === 3 // @test current === 3 // enum value
    `.trim()

    const result = executePuzzle({
      mode: 'code',
      codeText: code,
      solutionLines: [],
      isTypeScript: true,
      testLine: '',
      mandatoryLines: [],
      clue: 'enum value',
    })

    expect(result.success).toBe(true)
  })
})
