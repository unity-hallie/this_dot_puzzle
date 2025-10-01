import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  validateGeneratedPuzzle,
  loadApiKey,
  saveApiKey,
  clearApiKey,
  type AIProvider,
} from './aiGenerator'
import type { Puzzle } from './puzzleUtils'

describe('validateGeneratedPuzzle', () => {
  it('should accept a valid basic puzzle', () => {
    const puzzle: Puzzle = {
      id: 'test-1',
      code: `
let obj = { value: 0 } // @locked
this = obj // @locked
this.value = 13
this.value === 13 // @test this.value === _____ // test display
      `.trim()
    }

    const result = validateGeneratedPuzzle(puzzle)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should accept a valid TypeScript puzzle with all fields', () => {
    const puzzle: Puzzle = {
      id: 'types-1',
      title: 'Test Puzzle',
      difficulty: 3,
      language: 'typescript',
      teaches: ['interfaces', 'type-checking'],
      learning_notes: 'Tests TypeScript interfaces',
      hidden_vars: [{
        hint: 'the answer',
        vars: { ANSWER: 42 }
      }],
      code: `
interface State { num: number } // @locked
this.num = 42
this.num === ANSWER // @test this.num === _____ // the answer
      `.trim()
    }

    const result = validateGeneratedPuzzle(puzzle)
    expect(result.valid).toBe(true)
    expect(result.errors).toHaveLength(0)
  })

  it('should reject puzzle without id', () => {
    const puzzle = {
      code: 'this.value = 10 // @test this.value === _____ // test'
    } as Puzzle

    const result = validateGeneratedPuzzle(puzzle)
    expect(result.valid).toBe(false)
    expect(result.errors).toContainEqual({
      field: 'id',
      message: 'Puzzle must have an id'
    })
  })

  it('should reject puzzle without code', () => {
    const puzzle = {
      id: 'test-1'
    } as Puzzle

    const result = validateGeneratedPuzzle(puzzle)
    expect(result.valid).toBe(false)
    expect(result.errors).toContainEqual({
      field: 'code',
      message: 'Puzzle must have code as a string'
    })
  })

  it('should reject puzzle with empty code', () => {
    const puzzle: Puzzle = {
      id: 'test-1',
      code: '   '
    }

    const result = validateGeneratedPuzzle(puzzle)
    expect(result.valid).toBe(false)
    expect(result.errors).toContainEqual({
      field: 'code',
      message: 'Puzzle code cannot be empty'
    })
  })

  it('should reject puzzle without @test line', () => {
    const puzzle: Puzzle = {
      id: 'test-1',
      code: `
let obj = { value: 0 } // @locked
this.value = 13
      `.trim()
    }

    const result = validateGeneratedPuzzle(puzzle)
    expect(result.valid).toBe(false)
    expect(result.errors).toContainEqual({
      field: 'code',
      message: 'Puzzle must include at least one @test line'
    })
  })

  it('should reject invalid difficulty', () => {
    const puzzle: Puzzle = {
      id: 'test-1',
      difficulty: 10 as any,
      code: 'this.value = 10 // @test this.value === _____ // test'
    }

    const result = validateGeneratedPuzzle(puzzle)
    expect(result.valid).toBe(false)
    expect(result.errors).toContainEqual({
      field: 'difficulty',
      message: 'Difficulty must be 1-5'
    })
  })

  it('should reject invalid language', () => {
    const puzzle: Puzzle = {
      id: 'test-1',
      language: 'python' as any,
      code: 'this.value = 10 // @test this.value === _____ // test'
    }

    const result = validateGeneratedPuzzle(puzzle)
    expect(result.valid).toBe(false)
    expect(result.errors).toContainEqual({
      field: 'language',
      message: 'Language must be "javascript" or "typescript"'
    })
  })

  it('should warn about test line without display text', () => {
    const puzzle: Puzzle = {
      id: 'test-1',
      code: `
this.value = 10
this.value === 10 // @test this.value === 10
      `.trim()
    }

    const result = validateGeneratedPuzzle(puzzle)
    expect(result.valid).toBe(true)
    expect(result.warnings).toBeDefined()
    expect(result.warnings).toContain('Test line 1 should include display text after the expression')
  })

  it('should warn about no learner lines', () => {
    const puzzle: Puzzle = {
      id: 'test-1',
      code: `
let obj = { value: 13 } // @locked
this = obj // @locked
this.value === 13 // @test this.value === _____ // test
      `.trim()
    }

    const result = validateGeneratedPuzzle(puzzle)
    expect(result.valid).toBe(true)
    expect(result.warnings).toContain('Puzzle has no learner lines - it may be too constrained')
  })

  it('should warn about too many learner lines', () => {
    const puzzle: Puzzle = {
      id: 'test-1',
      code: `
let obj = { value: 0 } // @locked
this = obj // @locked
this.value = 1
this.value += 2
this.value += 3
this.value += 4
this.value += 5
this.value += 6
this.value === 21 // @test this.value === _____ // test
      `.trim()
    }

    const result = validateGeneratedPuzzle(puzzle)
    expect(result.valid).toBe(true)
    expect(result.warnings).toContain('Puzzle has many learner lines - consider simplifying')
  })

  it('should warn about uppercase vars without hidden_vars', () => {
    const puzzle: Puzzle = {
      id: 'test-1',
      code: `
this.value = TARGET
this.value === TARGET // @test this.value === _____ // test
      `.trim()
    }

    const result = validateGeneratedPuzzle(puzzle)
    expect(result.valid).toBe(true)
    expect(result.warnings).toContain('Code contains uppercase variables but no hidden_vars defined')
  })

  it('should reject teaches as non-array', () => {
    const puzzle: Puzzle = {
      id: 'test-1',
      teaches: 'not-an-array' as any,
      code: 'this.value = 10 // @test this.value === _____ // test'
    }

    const result = validateGeneratedPuzzle(puzzle)
    expect(result.valid).toBe(false)
    expect(result.errors).toContainEqual({
      field: 'teaches',
      message: 'teaches must be an array'
    })
  })

  it('should warn about empty teaches array', () => {
    const puzzle: Puzzle = {
      id: 'test-1',
      teaches: [],
      code: 'this.value = 10 // @test this.value === _____ // test'
    }

    const result = validateGeneratedPuzzle(puzzle)
    expect(result.valid).toBe(true)
    expect(result.warnings).toContain('teaches array is empty - consider adding learning objectives')
  })

  it('should reject hidden_vars as non-array', () => {
    const puzzle: Puzzle = {
      id: 'test-1',
      hidden_vars: { hint: 'test' } as any,
      code: 'this.value = 10 // @test this.value === _____ // test'
    }

    const result = validateGeneratedPuzzle(puzzle)
    expect(result.valid).toBe(false)
    expect(result.errors).toContainEqual({
      field: 'hidden_vars',
      message: 'hidden_vars must be an array'
    })
  })

  it('should reject hidden_var without hint', () => {
    const puzzle: Puzzle = {
      id: 'test-1',
      hidden_vars: [{
        vars: { VALUE: 10 }
      } as any],
      code: 'this.value = 10 // @test this.value === _____ // test'
    }

    const result = validateGeneratedPuzzle(puzzle)
    expect(result.valid).toBe(false)
    expect(result.errors).toContainEqual({
      field: 'hidden_vars[0].hint',
      message: 'Each hidden_var must have a hint string'
    })
  })

  it('should reject hidden_var without vars', () => {
    const puzzle: Puzzle = {
      id: 'test-1',
      hidden_vars: [{
        hint: 'test hint'
      } as any],
      code: 'this.value = 10 // @test this.value === _____ // test'
    }

    const result = validateGeneratedPuzzle(puzzle)
    expect(result.valid).toBe(false)
    expect(result.errors).toContainEqual({
      field: 'hidden_vars[0].vars',
      message: 'Each hidden_var must have a vars object'
    })
  })

  it('should accumulate multiple errors', () => {
    const puzzle: Puzzle = {
      id: 'test-1',
      difficulty: 99 as any,
      language: 'ruby' as any,
      teaches: 'string' as any,
      code: ''
    }

    const result = validateGeneratedPuzzle(puzzle)
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(1)
  })
})

describe('API key management', () => {
  const TEST_KEY = 'test-api-key-12345'
  const providers: AIProvider[] = ['openai', 'anthropic']

  beforeEach(() => {
    // Clear localStorage before each test
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.clear()
    }
  })

  afterEach(() => {
    // Clean up after each test
    providers.forEach(provider => clearApiKey(provider))
  })

  it('should save and load API key', () => {
    providers.forEach(provider => {
      saveApiKey(provider, TEST_KEY)
      const loaded = loadApiKey(provider)
      expect(loaded).toBe(TEST_KEY)
    })
  })

  it('should return null when no key is saved', () => {
    providers.forEach(provider => {
      const loaded = loadApiKey(provider)
      expect(loaded).toBeNull()
    })
  })

  it('should clear API key', () => {
    providers.forEach(provider => {
      saveApiKey(provider, TEST_KEY)
      expect(loadApiKey(provider)).toBe(TEST_KEY)

      clearApiKey(provider)
      expect(loadApiKey(provider)).toBeNull()
    })
  })

  it('should store keys separately for different providers', () => {
    const openaiKey = 'openai-key-123'
    const anthropicKey = 'anthropic-key-456'

    saveApiKey('openai', openaiKey)
    saveApiKey('anthropic', anthropicKey)

    expect(loadApiKey('openai')).toBe(openaiKey)
    expect(loadApiKey('anthropic')).toBe(anthropicKey)
  })

  it('should handle key updates', () => {
    const provider: AIProvider = 'openai'
    const key1 = 'first-key'
    const key2 = 'second-key'

    saveApiKey(provider, key1)
    expect(loadApiKey(provider)).toBe(key1)

    saveApiKey(provider, key2)
    expect(loadApiKey(provider)).toBe(key2)
  })
})
