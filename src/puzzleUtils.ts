// Declare NodeJS-style require to satisfy TypeScript when targeting ESM without @types/node
declare const require: any

export interface Puzzle {
  id: string | number
  title?: string
  clue: string
  code: string
  language?: 'javascript' | 'typescript'
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
      // Expose test line as an available item so it can be freely placed
      availableLines.push(line.trim())
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
  // Note: This is a token-ish replacement and intentionally does not
  // attempt to parse strings/comments. Tests document this limitation.
  let result = code
    // property access
    .replace(/\bthis\./g, 'thisContext.')
    // assignment
    .replace(/\bthis\s*=/g, 'thisContext =')
    // argument separators
    .replace(/\bthis\s*,/g, 'thisContext,')
    // call/paren close
    .replace(/\bthis\s*\)/g, 'thisContext)')
    // statement end
    .replace(/\bthis\s*;/g, 'thisContext;')
    // bracket access (e.g., this["key"]) 
    .replace(/\bthis\s*\[/g, 'thisContext[')
    // ternary (e.g., this ? a : b)
    .replace(/\bthis\s*\?/g, 'thisContext ?')
  return result
}

/**
 * Ensures locked lines appear in the same relative order as defined by lockedContents.
 * Non-locked lines keep their relative order; locked lines are rewritten to match lockedContents order.
 */
export function ensureLockedOrder(
  lines: SolutionLine[],
  lockedContents: string[],
): SolutionLine[] {
  const locked = lines.filter(l => l.isLocked)
  // Check if locked lines are in correct order
  let lastLockedIndex = -1
  for (const line of locked) {
    const expectedIndex = lockedContents.indexOf(line.content)
    if (expectedIndex <= lastLockedIndex) {
      // Out of order, recompose list with locked lines replaced in correct sequence
      const result: SolutionLine[] = []
      let lockedIdx = 0
      for (const item of lines) {
        if (item.isLocked) {
          if (lockedIdx < lockedContents.length) {
            result.push({
              content: lockedContents[lockedIdx],
              isLocked: true,
              isMandatory: false,
            })
            lockedIdx++
          }
        } else {
          result.push(item)
        }
      }
      return result
    }
    lastLockedIndex = expectedIndex
  }
  return lines
}

// Use the TypeScript compiler if available in the bundle; otherwise fall back to code as-is.
export function transpileTypeScript(code: string): string {
  try {
    // Prefer bundled compiler (if present via ES import bundling)
    // Lazy require pattern to avoid type-only dependency at compile time.
    const ts: any = ((): any => {
      try {
        return require('typescript')
      } catch {
        return (window as any)?.ts
      }
    })()

    if (!ts) return code

    const result = ts.transpileModule(code, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.ESNext,
      }
    })
    return result.outputText
  } catch (e) {
    console.error('TypeScript transpilation failed:', e)
    return code
  }
}
