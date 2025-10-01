import { replaceThisReferences, transpileTypeScript } from './puzzleUtils'

export interface ExecuteParams {
  mode: 'puzzle' | 'code'
  codeText: string
  solutionLines: string[]
  isTypeScript: boolean
  testLine: string
  mandatoryLines: string[]
  clue: string
  hiddenVars?: Record<string, any>
}

function prepare(code: string, isTS: boolean): string {
  let out = code
  if (isTS) out = transpileTypeScript(out)
  out = replaceThisReferences(out)
  return out
}

export interface ExecuteResult {
  result: string
  success: boolean
  usedMandatory: boolean
  thisContext: any
}

function transformInlineTests(raw: string): { code: string, asserts: number } {
  const lines = raw.split('\n')
  let asserts = 0
  const out = lines.map(l => {
    const m = l.match(/^\s*(.+?)\s*\/\/\s*@test\s+(.+)$/)
    if (m) {
      const expr = m[1].trim()
      const display = m[2].trim()
      asserts++
      return `__assert(( ${expr} ), ${JSON.stringify(display)})`
    }
    return l
  })
  return { code: out.join('\n'), asserts }
}

export function executePuzzle({
  mode,
  codeText,
  solutionLines,
  isTypeScript,
  testLine,
  mandatoryLines,
  clue,
  hiddenVars = {},
}: ExecuteParams): ExecuteResult {
  const thisContext: any = {}
  try {
    const raw = mode === 'code' ? codeText : solutionLines.join('\n')
    const { code: withAsserts, asserts } = transformInlineTests(raw)
    const userLines = solutionLines.filter(l => !/\/\/\s*@test/.test(l)).filter(l => l.trim() !== '')
    const usedMandatory = mandatoryLines.every(line => userLines.includes(line))

    // Inject hidden variables into scope
    const varDeclarations = Object.entries(hiddenVars)
      .map(([key, value]) => `const ${key} = ${JSON.stringify(value)};`)
      .join('\n')

    if (asserts > 0) {
      const prelude = 'var __failures=[]; function __assert(c,m){ if(!c) __failures.push(m) }\n'
      const execCode = prepare(prelude + varDeclarations + '\n' + withAsserts + '\nreturn __failures', isTypeScript)
      const run = new Function('thisContext', '"use strict";\n' + execCode)
      const failures: any[] = run(thisContext)
      if (!usedMandatory) {
        return { result: '✗ missing required lines', success: false, usedMandatory, thisContext }
      }
      if (failures.length === 0) {
        return { result: `✓ ${clue}`, success: true, usedMandatory, thisContext }
      }
      return { result: `✗ ${failures[0] ?? 'failed'}`, success: false, usedMandatory, thisContext }
    } else {
      const execCode = prepare(varDeclarations + '\n' + raw, isTypeScript)
      const testCode = prepare(testLine, isTypeScript)
      const runAll = new Function('thisContext', '"use strict";\n' + execCode + '\nreturn ( ' + testCode + ' )')
      const success = !!runAll(thisContext)
      if (!usedMandatory) {
        return { result: '✗ missing required lines', success: false, usedMandatory, thisContext }
      }
      if (success) {
        return { result: `✓ ${clue}`, success: true, usedMandatory, thisContext }
      }
      return { result: `✗ ${JSON.stringify(thisContext)}`, success: false, usedMandatory, thisContext }
    }
  } catch (e: any) {
    return { result: `error: ${e?.message ?? String(e)}`, success: false, usedMandatory: false, thisContext }
  }
}
