# AI Puzzle Generator 🤖

## What's Built

I've created the complete AI puzzle generation infrastructure! Here's what we have:

### Core Components

1. **`src/aiGenerator.ts`** - Main generation engine
   - Support for both OpenAI and Anthropic APIs
   - Load API keys from `.env` or localStorage
   - `generatePuzzle()` - generate new puzzles from prompts
   - `validateGeneratedPuzzle()` - ensure correct format
   - System prompt embedding our DSL and Miyamoto principles

2. **`src/components/AISettings.tsx`** - Settings UI
   - Configure API provider (OpenAI/Anthropic)
   - Enter API key securely
   - Optional model override
   - Save to localStorage

3. **`src/components/PuzzleGenerator.tsx`** - Generation UI
   - Text prompt input
   - Difficulty slider (1-5)
   - Teaches concepts (comma-separated)
   - Generate button with loading state

### How to Use

#### 1. Set up API Keys

**Option A: Environment variables** (recommended for dev)
```bash
# Copy example
cp .env.example .env

# Edit .env and add your key:
VITE_OPENAI_API_KEY=sk-...
# OR
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

**Option B: UI Settings Panel**
- Click settings icon
- Select provider
- Enter API key
- Saves to localStorage

#### 2. Generate a Puzzle

```typescript
import { generatePuzzle } from './aiGenerator'

const puzzle = await generatePuzzle({
  prompt: "Create a puzzle teaching closures with a counter",
  difficulty: 3,
  teaches: ["closures", "state-management"]
})

// Returns a Puzzle object ready to use!
```

#### 3. Get Help for Stuck Learners

```typescript
import { generateHint } from './aiGenerator'

const help = await generateHint(
  currentPuzzle,
  userSolution,
  attemptCount
)

// Returns: { hint?: string, simplerPuzzle?: Puzzle }
```

## Features

### Smart Prompt Engineering

The system prompt includes:
- Full DSL documentation (@locked, @mandatory, @test)
- Hidden variables philosophy
- Miyamoto distractor principles
- Example patterns

### Validation

Generated puzzles are validated for:
- Required fields (id, code, title)
- Must have @test line
- Must have hidden_vars if using variables
- Difficulty in valid range

### Privacy & Security

- API keys stored locally (never sent to our servers)
- Keys encrypted in localStorage
- Clear privacy notice in UI
- Works offline (core puzzles don't need AI)

## Next Steps to Integrate

### Phase 1: Add to Menu
```tsx
// In App.tsx menu view
const [showSettings, setShowSettings] = useState(false)
const [showGenerator, setShowGenerator] = useState(false)

// Add buttons:
<button onClick={() => setShowSettings(true)}>⚙️ AI Settings</button>
<button onClick={() => setShowGenerator(true)}>✨ Generate Puzzle</button>

// Render modals:
{showSettings && <AISettings onClose={() => setShowSettings(false)} />}
{showGenerator && (
  <PuzzleGenerator
    onGenerated={(puzzle) => {
      // Preview puzzle or add to custom level
      setShowGenerator(false)
    }}
  />
)}
```

### Phase 2: "I'm Confused" Button
```tsx
// In puzzle view
<button onClick={handleConfused}>❓ I'm Confused</button>

const handleConfused = async () => {
  const help = await generateHint(
    selectedPuzzle,
    solution.map(l => l.content),
    attemptCount
  )

  if (help.hint) {
    // Show hint modal
  } else if (help.simplerPuzzle) {
    // Offer to try simpler version
  }
}
```

### Phase 3: Designer Mode
- Full level generator (batch create)
- Export puzzles to files for commit
- Community puzzle sharing

## Example Prompts

**Easy closure:**
> "Create a simple puzzle teaching closure basics with a counter that increments"

**TypeScript generics:**
> "Generate a TypeScript puzzle about generic functions that preserve type information"

**Challenge variant:**
> "Make a harder version of basics-5 teaching operator precedence"

**Contextual help:**
> "The learner failed basics-4 three times. Generate an easier warmup puzzle."

## API Costs

Estimated costs (using gpt-4o-mini):
- Single puzzle: ~$0.001 (less than a penny)
- Hint generation: ~$0.0005
- Level (5 puzzles): ~$0.005

Even cheaper with Claude Haiku!

## Testing

```bash
# Build check
npm run build

# The components are built but not integrated yet
# To test manually:
# 1. Add AISettings to App.tsx
# 2. Add your API key
# 3. Try generating a puzzle
```

## What's Next?

Ready to integrate! Want me to:
1. Wire up the AI settings button to main menu?
2. Add "Generate Similar" to puzzle cards?
3. Build the "I'm Confused" feature?
4. Something else?

Let me know what you want to tackle first! 🚀
