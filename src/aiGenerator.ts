import type { Puzzle } from './puzzleUtils'

export type AIProvider = 'openai' | 'anthropic'

export interface AIConfig {
  provider: AIProvider
  apiKey: string
  model?: string
}

export interface GeneratePuzzleRequest {
  prompt: string
  difficulty?: 1 | 2 | 3 | 4 | 5
  teaches?: string[]
  basedOn?: Puzzle
  learnerContext?: {
    completedPuzzles: string[]
    currentPuzzle?: string
    attemptCount?: number
    solutionSoFar?: string[]
  }
}

export function loadAIConfig(): AIConfig | null {
  const openaiKey = import.meta.env.VITE_OPENAI_API_KEY
  const anthropicKey = import.meta.env.VITE_ANTHROPIC_API_KEY

  if (openaiKey) {
    return {
      provider: 'openai',
      apiKey: openaiKey,
      model: import.meta.env.VITE_AI_MODEL || 'gpt-4o-mini'
    }
  }

  if (anthropicKey) {
    return {
      provider: 'anthropic',
      apiKey: anthropicKey,
      model: import.meta.env.VITE_AI_MODEL || 'claude-sonnet-4'
    }
  }

  const stored = localStorage.getItem('ai_config')
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return null
    }
  }

  return null
}

export function saveAIConfig(config: AIConfig): void {
  localStorage.setItem('ai_config', JSON.stringify(config))
}

const SYSTEM_PROMPT = `You are generating puzzles for "this.puzzle" educational game.

Generate as JSON matching this interface:
{
  id: "unique-id",
  title: "Title",
  difficulty: 1-5,
  teaches: ["concept"],
  hidden_vars: [{ hint: "clue", vars: { VAR: value }}],
  code: "puzzle code with // @locked, // @mandatory, // @test markers"
}

Use hidden variables (UPPERCASE_NAMES) instead of answer literals.
Include 2-5 learner lines, minimal setup.
Distractors should teach, not confuse (Miyamoto principle).`

export function validateGeneratedPuzzle(puzzle: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  if (!puzzle.id) errors.push('Missing id')
  if (!puzzle.code) errors.push('Missing code')
  if (!puzzle.code?.includes('// @test')) errors.push('Missing @test line')
  return { valid: errors.length === 0, errors }
}

export async function generatePuzzle(req: GeneratePuzzleRequest, config?: AIConfig): Promise<Puzzle> {
  const cfg = config || loadAIConfig()
  if (!cfg) throw new Error('No AI config')

  const prompt = `${req.prompt}
Difficulty: ${req.difficulty || 3}/5
Teaches: ${req.teaches?.join(', ') || 'general'}
Return JSON only.`

  if (cfg.provider === 'openai') {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cfg.apiKey}`
      },
      body: JSON.stringify({
        model: cfg.model || 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      })
    })
    const data = await res.json()
    return JSON.parse(data.choices[0].message.content)
  } else {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': cfg.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: cfg.model || 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: prompt }]
      })
    })
    const data = await res.json()
    const match = data.content[0].text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('No JSON in response')
    return JSON.parse(match[0])
  }
}
