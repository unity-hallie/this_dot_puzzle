export interface Puzzle {
  id: number
  clue: string
  code: string
}

export interface ParsedLine {
  content: string
  type: 'locked' | 'mandatory' | 'available'
  originalPosition?: number
}

export interface SolutionLine {
  content: string
  isLocked: boolean
  isMandatory: boolean
}

export function parsePuzzleCode(code: string) {
  const lines = code.trim().split('\n')
  const lockedLines: ParsedLine[] = []
  const mandatoryLines: string[] = []
  const availableLines: string[] = []
  let testLine = ''
  let testDisplay = ''
  let position = 0

  lines.forEach(line => {
    if (line.includes('// @test')) {
      const match = line.match(/^(.+?)\s*\/\/ @test\s+(.+)$/)
      if (match) {
        testLine = match[1].trim()
        testDisplay = match[2].trim()
      }
    } else if (line.includes('// @locked')) {
      const content = line.replace(/\s*\/\/ @locked.*$/, '').trim()
      lockedLines.push({ content, type: 'locked', originalPosition: position })
      position++
    } else if (line.includes('// @mandatory')) {
      const content = line.replace(/\s*\/\/ @mandatory.*$/, '').trim()
      mandatoryLines.push(content)
    } else if (line.trim()) {
      availableLines.push(line.trim())
    }
  })

  return { lockedLines, mandatoryLines, availableLines, testLine, testDisplay }
}

export function replaceThisReferences(code: string): string {
  let result = code.replace(/this\./g, 'thisContext.')
  result = result.replace(/this =/g, 'thisContext =')
  result = result.replace(/this,/g, 'thisContext,')
  result = result.replace(/this\)/g, 'thisContext)')
  result = result.replace(/this;/g, 'thisContext;')
  return result
}
