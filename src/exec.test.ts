import { describe, it, expect } from 'vitest'
import { executePuzzle } from './exec'

describe('executePuzzle (inline @test)', () => {
  it('passes when inline @test evaluates truthy', () => {
    const solutionLines = [
      'let x = 1',
      'x += 1 // @test x === 2 // should be 2',
    ]
    const res = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: [],
      clue: 'ok',
    })
    expect(res.success).toBe(true)
    expect(res.result.startsWith('✓')).toBe(true)
  })

  it('fails with first failing inline test message', () => {
    const solutionLines = [
      'let y = 3',
      'y += 1',
      'y === 5 // @test make five',
    ]
    const res = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: [],
      clue: 'ok',
    })
    expect(res.success).toBe(false)
    expect(res.result).toContain('make five')
  })

  it('runs multiple inline tests and reports first failing display', () => {
    const solutionLines = [
      'let n = 2',
      'n += 2 // @test n === 4 // sum ok',
      'n * 2 === 10 // @test even not ten',
    ]
    const res = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: [],
      clue: 'ok',
    })
    expect(res.success).toBe(false)
    expect(res.result).toContain('even not ten')
  })

  it('surfaces thrown errors as error: message', () => {
    const solutionLines = [
      'throw new Error("boom")',
      'true // @test should not run',
    ]
    const res = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: [],
      clue: 'ok',
    })
    expect(res.success).toBe(false)
    expect(res.result.startsWith('error:')).toBe(true)
    expect(res.result).toContain('boom')
  })

  it('respects mandatoryLines even when inline tests pass', () => {
    const solutionLines = [
      'let z = 2',
      'z *= 2 // @test z === 4 // doubled',
    ]
    const res = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: ['z = 2'],
      clue: 'ok',
    })
    expect(res.success).toBe(false)
    expect(res.result).toContain('missing required lines')
  })
})

describe('executePuzzle (fallback single test)', () => {
  it('runs legacy single test when no inline @test present', () => {
    const solutionLines = [
      'let a = 10',
      'a += 5',
    ]
    const res = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: 'a === 15',
      mandatoryLines: [],
      clue: 'ok',
    })
    expect(res.success).toBe(true)
  })
})

describe('executePuzzle (test line requirements)', () => {
  it('should fail when inline test line is not in solution', () => {
    // User drags code but NOT the test line
    const solutionLines = [
      'let x = 5',
      'x += 8',
      // Missing: 'x === 13 // @test x === TARGET // the goal'
    ]
    const res = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: [],
      clue: 'should not pass',
      hiddenVars: { TARGET: 13 }
    })
    // Should fail because no test line present
    expect(res.success).toBe(false)
    expect(res.result).toContain('missing test assertion')
  })

  it('test line should have access to solution scope', () => {
    const solutionLines = [
      'let value = 10',
      'value += 3',
      'value === TARGET // @test value === TARGET // goal'
    ]
    const res = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: [],
      clue: 'ok',
      hiddenVars: { TARGET: 13 }
    })
    // Test line should see 'value' variable from earlier lines
    expect(res.success).toBe(true)
  })

  it('should fail when solution code is wrong even with test line present', () => {
    const solutionLines = [
      'let x = 5',
      'x += 5', // Wrong: should be += 8
      'x === TARGET // @test x === TARGET // goal'
    ]
    const res = executePuzzle({
      mode: 'puzzle',
      codeText: '',
      solutionLines,
      isTypeScript: false,
      testLine: '',
      mandatoryLines: [],
      clue: 'nope',
      hiddenVars: { TARGET: 13 }
    })
    expect(res.success).toBe(false)
  })
})
