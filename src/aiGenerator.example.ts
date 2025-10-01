/**
 * Example usage of the AI Puzzle Generator module
 *
 * This file demonstrates how to use the aiGenerator module but is NOT
 * integrated into the main app. It serves as documentation and reference.
 */

import { generatePuzzle, validateGeneratedPuzzle, loadApiKey, saveApiKey, testApiKey } from './aiGenerator'
import type { AIProvider } from './aiGenerator'

// ============================================================================
// Example 1: Basic puzzle generation with simple prompt
// ============================================================================
async function example1_BasicGeneration() {
  console.log('Example 1: Basic Generation')

  try {
    const result = await generatePuzzle("closures and lexical scope")

    console.log('Generated puzzle ID:', result.puzzle.id)
    console.log('Raw code:\n', result.rawCode)
    console.log('Validation:', result.validation.valid ? 'PASSED' : 'FAILED')

    if (!result.validation.valid) {
      console.error('Errors:', result.validation.errors)
    }

    if (result.validation.warnings) {
      console.warn('Warnings:', result.validation.warnings)
    }
  } catch (error) {
    console.error('Generation failed:', error)
  }
}

// ============================================================================
// Example 2: Advanced generation with detailed options
// ============================================================================
async function example2_AdvancedGeneration() {
  console.log('Example 2: Advanced Generation')

  try {
    const result = await generatePuzzle({
      topic: "TypeScript generic functions",
      difficulty: 4,
      language: 'typescript',
      teaches: ['generics', 'type-inference', 'function-types'],
      temperature: 0.8
    }, {
      provider: 'anthropic',
      model: 'claude-3-5-sonnet-20241022'
    })

    console.log('Generated TypeScript puzzle:', result.puzzle.title)
    console.log('Difficulty:', result.puzzle.difficulty)
    console.log('Teaches:', result.puzzle.teaches)
  } catch (error) {
    console.error('Generation failed:', error)
  }
}

// ============================================================================
// Example 3: Using OpenAI provider explicitly
// ============================================================================
async function example3_OpenAIProvider() {
  console.log('Example 3: OpenAI Provider')

  try {
    const result = await generatePuzzle({
      topic: "arrow functions vs regular functions",
      difficulty: 2,
      teaches: ['arrow-syntax', 'implicit-return']
    }, {
      provider: 'openai',
      model: 'gpt-4-turbo-preview'
    })

    console.log('Generated with OpenAI:', result.puzzle.id)
  } catch (error) {
    console.error('Generation failed:', error)
  }
}

// ============================================================================
// Example 4: Manual puzzle validation
// ============================================================================
function example4_ManualValidation() {
  console.log('Example 4: Manual Validation')

  const customPuzzle = {
    id: 'custom-closure-1',
    title: 'Counter Closure',
    difficulty: 3 as const,
    teaches: ['closures', 'encapsulation'],
    hidden_vars: [{
      hint: 'three calls',
      vars: { RESULT: 3 }
    }],
    code: `
function makeCounter() { // @locked
  let count = 0 // @locked
  return () => count++ // @locked
} // @locked
const counter = makeCounter() // @locked
counter()
counter()
counter()
counter() === RESULT // @test counter() === _____ // three calls
    `.trim()
  }

  const validation = validateGeneratedPuzzle(customPuzzle)

  console.log('Valid:', validation.valid)

  if (!validation.valid) {
    console.error('Errors found:')
    validation.errors.forEach(err => {
      console.error(`  - ${err.field}: ${err.message}`)
    })
  }

  if (validation.warnings) {
    console.warn('Warnings:')
    validation.warnings.forEach(warn => console.warn(`  - ${warn}`))
  }
}

// ============================================================================
// Example 5: API key management
// ============================================================================
async function example5_KeyManagement() {
  console.log('Example 5: API Key Management')

  const provider: AIProvider = 'openai'
  const testKey = 'sk-test-key-12345'

  // Save a key
  saveApiKey(provider, testKey)
  console.log('Key saved')

  // Load the key
  const loadedKey = loadApiKey(provider)
  console.log('Loaded key:', loadedKey?.substring(0, 10) + '...')

  // Test the key (will fail with fake key)
  try {
    const result = await testApiKey({
      provider,
      apiKey: loadedKey || '',
      model: 'gpt-4-turbo-preview'
    })

    if (result.success) {
      console.log('API key is valid!')
    } else {
      console.error('API key test failed:', result.error)
    }
  } catch (error) {
    console.error('API test error:', error)
  }
}

// ============================================================================
// Example 6: Batch generation (simple loop)
// ============================================================================
async function example6_BatchGeneration() {
  console.log('Example 6: Batch Generation')

  const topics = [
    "this binding in objects",
    "this in arrow vs regular functions",
    "this in event handlers"
  ]

  const results = []

  for (const topic of topics) {
    try {
      console.log(`Generating puzzle for: ${topic}`)
      const result = await generatePuzzle(topic, { provider: 'openai' })

      if (result.validation.valid) {
        results.push(result.puzzle)
        console.log(`  ✓ Generated: ${result.puzzle.id}`)
      } else {
        console.error(`  ✗ Validation failed for: ${topic}`)
      }

      // Rate limiting: wait 1 second between requests
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`  ✗ Failed to generate for ${topic}:`, error)
    }
  }

  console.log(`\nSuccessfully generated ${results.length}/${topics.length} puzzles`)
  return results
}

// ============================================================================
// Example 7: Error handling patterns
// ============================================================================
async function example7_ErrorHandling() {
  console.log('Example 7: Error Handling')

  // Handle missing API key
  try {
    await generatePuzzle("test topic")
  } catch (error) {
    if (error instanceof Error && error.message.includes('No API key found')) {
      console.log('No API key configured. Please set up your keys in Settings.')
    }
  }

  // Handle validation errors
  const result = await generatePuzzle("test topic").catch(() => null)
  if (result && !result.validation.valid) {
    console.log('Validation failed:')
    result.validation.errors.forEach(err => {
      console.log(`  ${err.field}: ${err.message}`)
    })

    // Could prompt user to edit or regenerate
  }

  // Handle network errors
  try {
    await generatePuzzle("test topic")
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        console.error('Network error. Check your internet connection.')
      } else if (error.message.includes('API error')) {
        console.error('API error. Check your API key and quota.')
      } else {
        console.error('Unexpected error:', error.message)
      }
    }
  }
}

// ============================================================================
// Export examples for testing/documentation
// ============================================================================
export const examples = {
  basicGeneration: example1_BasicGeneration,
  advancedGeneration: example2_AdvancedGeneration,
  openAIProvider: example3_OpenAIProvider,
  manualValidation: example4_ManualValidation,
  keyManagement: example5_KeyManagement,
  batchGeneration: example6_BatchGeneration,
  errorHandling: example7_ErrorHandling,
}

// ============================================================================
// Run all examples (commented out - uncomment to test)
// ============================================================================
// async function runAllExamples() {
//   await example1_BasicGeneration()
//   await example2_AdvancedGeneration()
//   await example3_OpenAIProvider()
//   example4_ManualValidation()
//   await example5_KeyManagement()
//   await example6_BatchGeneration()
//   await example7_ErrorHandling()
// }

// Uncomment to run:
// runAllExamples().catch(console.error)
