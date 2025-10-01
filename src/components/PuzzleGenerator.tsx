import { useState } from 'react'
import { generatePuzzle, type GeneratePuzzleRequest } from '../aiGenerator'
import type { Puzzle } from '../puzzleUtils'

export default function PuzzleGenerator({ onGenerated }: { onGenerated: (puzzle: Puzzle) => void }) {
  const [prompt, setPrompt] = useState('')
  const [difficulty, setDifficulty] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [teaches, setTeaches] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setLoading(true)
    setError('')

    try {
      const request: GeneratePuzzleRequest = {
        prompt,
        difficulty,
        teaches: teaches.split(',').map(t => t.trim()).filter(Boolean)
      }

      const puzzle = await generatePuzzle(request)
      onGenerated(puzzle)
    } catch (err: any) {
      setError(err.message || 'Failed to generate puzzle')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
      <h3>Generate New Puzzle</h3>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
          Prompt:
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Create a puzzle teaching closure with counter"
            style={{
              display: 'block',
              width: '100%',
              minHeight: '60px',
              padding: '0.5rem',
              marginTop: '0.25rem'
            }}
          />
        </label>
      </div>

      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <label>
          Difficulty:
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(parseInt(e.target.value) as any)}
            style={{ marginLeft: '0.5rem', padding: '0.25rem' }}
          >
            <option value={1}>1 - Easiest</option>
            <option value={2}>2 - Easy</option>
            <option value={3}>3 - Medium</option>
            <option value={4}>4 - Hard</option>
            <option value={5}>5 - Hardest</option>
          </select>
        </label>

        <label style={{ flex: 1 }}>
          Teaches (comma-separated):
          <input
            value={teaches}
            onChange={(e) => setTeaches(e.target.value)}
            placeholder="closures, arrow-functions"
            style={{ marginLeft: '0.5rem', padding: '0.25rem', width: '60%' }}
          />
        </label>
      </div>

      {error && (
        <div style={{
          padding: '0.5rem',
          background: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading || !prompt}
        style={{
          padding: '0.5rem 1rem',
          background: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Generating...' : 'Generate Puzzle'}
      </button>
    </div>
  )
}
