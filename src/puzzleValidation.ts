import { executePuzzle } from './exec'
import type { Puzzle } from './puzzleUtils'
import { LEVELS } from './puzzles'

export interface PuzzleFailure {
  id: string | number
  title?: string
  reason: string
}

function splitPuzzle(puzzle: Puzzle): { codeText: string; testLine: string; isTS: boolean } {
  const isTS = puzzle.language === 'typescript'
  const lines = puzzle.code.split('\n')
  let testLine = ''
  const body: string[] = []
  for (const raw of lines) {
    if (raw.includes('// @test')) {
      const match = raw.match(/^(.+?)\s*\/\/ @test\s+(.+)$/)
      if (match) testLine = match[1].trim()
      continue
    }
    const withoutLocked = raw.replace(/\s*\/\/ @locked.*$/, '')
    const withoutMandatory = withoutLocked.replace(/\s*\/\/ @mandatory.*$/, '')
    const code = withoutMandatory.trimEnd()
    if (code.trim().length > 0) body.push(code)
  }
  return { codeText: body.join('\n'), testLine, isTS }
}

export function validateAllPuzzles(): PuzzleFailure[] {
  const failures: PuzzleFailure[] = []
  for (const level of LEVELS) {
    for (const puzzle of level.puzzles) {
      const { codeText, testLine, isTS } = splitPuzzle(puzzle)
      if (!testLine) {
        failures.push({ id: puzzle.id, title: puzzle.title, reason: 'Missing @test line' })
        continue
      }
      const res = executePuzzle({
        mode: 'code',
        codeText,
        solutionLines: [],
        isTypeScript: isTS,
        testLine,
        mandatoryLines: [],
        clue: puzzle.clue,
      })
      if (!res.success) {
        failures.push({ id: puzzle.id, title: puzzle.title, reason: res.result })
      }
    }
  }
  return failures
}

