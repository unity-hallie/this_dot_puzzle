# AI Puzzle Generator Module

This module provides AI-powered puzzle generation infrastructure for this.puzzle using OpenAI (GPT-4) or Anthropic (Claude) APIs.

## Files

- `src/aiGenerator.ts` - Core AI generation module with validation
- `src/aiGenerator.test.ts` - Comprehensive unit tests for validation logic
- `src/components/SettingsPanel.tsx` - React UI component for API key configuration
- `.env.example` - Template for environment variables

## Features

### API Configuration
- Support for both OpenAI and Anthropic providers
- API keys can be loaded from:
  - Environment variables (`.env` file for development)
  - Browser localStorage (for production)
- Secure key management with localStorage persistence
- Key validation/testing functionality

### Puzzle Generation
- **generatePuzzle()** - Main function to generate puzzles with AI
- Accepts either a simple string prompt or detailed options:
  ```typescript
  generatePuzzle("closures", { provider: 'openai' })

  // OR with detailed options:
  generatePuzzle({
    topic: "closures",
    difficulty: 3,
    language: 'typescript',
    teaches: ['lexical-scope', 'function-returns']
  }, config)
  ```

### Validation System
- **validateGeneratedPuzzle()** - Validates puzzle structure
- Checks required fields: `id`, `code`, `@test` lines
- Validates optional fields: `difficulty`, `language`, `teaches`, `hidden_vars`
- Returns validation results with:
  - `valid` boolean
  - `errors` array (blocking issues)
  - `warnings` array (suggestions)

### System Prompt
The module includes a comprehensive system prompt that:
- Teaches the AI about the puzzle DSL (`@locked`, `@mandatory`, `@test`)
- Provides design principles (one concept per puzzle, 2-5 learner lines)
- Includes example puzzles
- Ensures consistent output format

## Installation

Already completed:
```bash
npm install dotenv  # ✓ Done
```

## Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your API keys to `.env`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```

3. For browser usage, API keys can be configured via the Settings Panel UI component.

## Usage Examples

### Basic Generation
```typescript
import { generatePuzzle } from './aiGenerator'

const result = await generatePuzzle("arrow functions and lexical this")

if (result.validation.valid) {
  console.log('Generated puzzle:', result.puzzle)
} else {
  console.error('Validation errors:', result.validation.errors)
}
```

### Advanced Generation
```typescript
const result = await generatePuzzle({
  topic: "TypeScript generics",
  difficulty: 4,
  language: 'typescript',
  teaches: ['generic-functions', 'type-inference'],
  temperature: 0.8
}, {
  provider: 'anthropic',
  model: 'claude-3-5-sonnet-20241022'
})
```

### Manual Validation
```typescript
import { validateGeneratedPuzzle } from './aiGenerator'

const puzzle = {
  id: 'custom-1',
  code: '...'
}

const validation = validateGeneratedPuzzle(puzzle)

if (!validation.valid) {
  validation.errors.forEach(err => {
    console.error(`${err.field}: ${err.message}`)
  })
}

if (validation.warnings?.length) {
  validation.warnings.forEach(warn => console.warn(warn))
}
```

### API Key Management
```typescript
import { loadApiKey, saveApiKey, clearApiKey, testApiKey } from './aiGenerator'

// Save key
saveApiKey('openai', 'sk-...')

// Load key
const key = loadApiKey('openai')

// Test key validity
const result = await testApiKey({
  provider: 'openai',
  apiKey: key,
  model: 'gpt-4-turbo-preview'
})

if (!result.success) {
  console.error('Invalid key:', result.error)
}

// Clear key
clearApiKey('openai')
```

### Using the Settings Panel Component
```typescript
import SettingsPanel from './components/SettingsPanel'

function App() {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <>
      <button onClick={() => setShowSettings(true)}>Settings</button>
      {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
    </>
  )
}
```

## Validation Rules

### Required
- `id` - Must be string or number
- `code` - Must be non-empty string
- At least one `// @test` line in code

### Optional Field Validation
- `difficulty` - Must be 1-5
- `language` - Must be 'javascript' or 'typescript'
- `teaches` - Must be array (warns if empty)
- `hidden_vars` - Must be array with `hint` and `vars` properties

### Code Quality Warnings
- Test lines should include display text (second `//` after expression)
- 0 learner lines → may be too constrained
- \>5 learner lines → consider simplifying
- Uppercase variables without `hidden_vars` → might need hidden values

## Testing

Run validation tests:
```bash
npm run test:safe -- src/aiGenerator.test.ts
```

Current coverage: 23 tests covering:
- Valid puzzle formats (JavaScript and TypeScript)
- Required field validation
- Optional field validation
- Code quality checks
- API key management (save, load, clear)

## Architecture Notes

### Why Two API Providers?
- **OpenAI (GPT-4)** - Well-known, widely adopted, good documentation
- **Anthropic (Claude)** - Strong reasoning, longer context windows, excellent instruction following

Users can choose based on:
- API costs
- Rate limits
- Personal preference
- Specific model capabilities

### Security Considerations
- API keys stored in localStorage (browser) or environment variables (dev)
- Keys never sent to our servers - only direct API calls to OpenAI/Anthropic
- `.env` files are gitignored
- No hardcoded keys in code

### Error Handling
All API calls wrapped in try/catch with descriptive error messages:
- Network failures
- Invalid API keys
- Rate limiting
- Malformed responses
- Parsing errors

## Integration (Not Yet Implemented)

The module is standalone and ready for integration. Future work:

1. Add UI button to trigger puzzle generation
2. Display generated puzzle in a preview pane
3. Allow editing before adding to puzzle collection
4. Save generated puzzles to appropriate level folders
5. Add batch generation support
6. Track generation history/logs

## Limitations

### Current
- No retry logic for transient failures
- No streaming support (waits for full response)
- Basic prompt engineering (can be enhanced)
- No fine-tuning or custom models
- Manual puzzle review required before use

### Code Parsing
The `parsePuzzleFromCode()` function uses `Function()` constructor to evaluate generated TypeScript objects. This is safer than `eval()` but still requires trust in the AI output. The validation layer provides additional safety.

## Cost Considerations

API calls are metered by providers:
- OpenAI: ~$0.01-0.03 per puzzle (GPT-4)
- Anthropic: ~$0.01-0.02 per puzzle (Claude 3.5 Sonnet)

Estimate ~$1-3 per 100 generated puzzles. Most users will generate puzzles infrequently, so costs remain minimal.

## Troubleshooting

### "No API key found"
- Check `.env` file has correct format
- Verify key is saved in Settings Panel
- Check localStorage in browser DevTools

### "API call failed"
- Verify API key is valid (use Test button)
- Check internet connection
- Review rate limits on provider dashboard
- Check API key permissions/credits

### "Failed to parse generated puzzle"
- AI output may not match expected format
- Try regenerating with more specific prompt
- Check validation errors for details
- May need to manually edit raw output

### Validation errors
- Review the `errors` array in validation result
- Common issues: missing test lines, invalid difficulty, malformed code
- Use warnings as guidance for improvement

## Future Enhancements

- Add puzzle difficulty estimation
- Multi-puzzle batch generation
- Generation from existing puzzle variations
- A/B testing generated vs. manual puzzles
- Learning analytics to identify weak concepts
- Collaborative filtering for puzzle quality
- Export/import puzzle packs
- Community puzzle marketplace
