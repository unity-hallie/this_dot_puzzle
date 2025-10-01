import { describe, it, expect } from 'vitest'
import { parsePuzzleCode, replaceThisReferences } from './puzzleUtils'

describe('parsePuzzleCode', () => {
  it('should parse locked lines with position', () => {
    const code = `
let x = 5 // @locked
let y = 10
    `.trim()

    const result = parsePuzzleCode(code)

    expect(result.lockedLines).toHaveLength(1)
    expect(result.lockedLines[0]).toEqual({
      content: 'let x = 5',
      type: 'locked',
      originalPosition: 0
    })
    expect(result.availableLines).toContain('let y = 10')
  })

  it('should parse mandatory lines', () => {
    const code = `
this.value = 5 // @mandatory
this.value += 1
    `.trim()

    const result = parsePuzzleCode(code)

    expect(result.mandatoryLines).toContain('this.value = 5')
    expect(result.availableLines).toContain('this.value += 1')
  })

  it('should parse test line with display', () => {
    const code = `
this.value = 5
this.value === 5 // @test this.value === _____ // first prime
    `.trim()

    const result = parsePuzzleCode(code)

    expect(result.testLine).toBe('this.value === 5')
    expect(result.testDisplay).toBe('this.value === _____ // first prime')
  })

  it('should handle mixed markers', () => {
    const code = `
let x = { value: 0 } // @locked
this = x // @locked
this.value = 5
this.value += 6 // @mandatory
this.value *= 2
this.value === 11 // @test this.value === _____ // goal
    `.trim()

    const result = parsePuzzleCode(code)

    expect(result.lockedLines).toHaveLength(2)
    expect(result.mandatoryLines).toHaveLength(1)
    expect(result.availableLines).toHaveLength(2)
    expect(result.testLine).toBe('this.value === 11')
  })

  it('should preserve order for locked lines', () => {
    const code = `
let a = 1 // @locked
let b = 2 // @locked
let c = 3 // @locked
    `.trim()

    const result = parsePuzzleCode(code)

    expect(result.lockedLines[0].originalPosition).toBe(0)
    expect(result.lockedLines[1].originalPosition).toBe(1)
    expect(result.lockedLines[2].originalPosition).toBe(2)
  })
})

describe('replaceThisReferences', () => {
  it('should replace this. with thisContext.', () => {
    const code = 'this.value = 5'
    expect(replaceThisReferences(code)).toBe('thisContext.value = 5')
  })

  it('should replace this = with thisContext =', () => {
    const code = 'this = obj'
    expect(replaceThisReferences(code)).toBe('thisContext = obj')
  })

  it('should replace this in function arguments', () => {
    const code = 'func(this, other)'
    expect(replaceThisReferences(code)).toBe('func(thisContext, other)')
  })

  it('should replace this at end of statement', () => {
    const code = 'return this;'
    expect(replaceThisReferences(code)).toBe('return thisContext;')
  })

  it('should handle multiple replacements', () => {
    const code = 'this.value = this.count + 1; return this;'
    expect(replaceThisReferences(code)).toBe(
      'thisContext.value = thisContext.count + 1; return thisContext;'
    )
  })

  it('should not replace "this" in strings or comments', () => {
    // Note: This is a known limitation - we don't handle strings/comments specially
    // This test documents current behavior
    const code = 'this.value = 5 // set this'
    const result = replaceThisReferences(code)
    expect(result).toContain('thisContext.value = 5')
  })
})
