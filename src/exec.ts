import { replaceThisReferences, transpileTypeScript } from './puzzleUtils'

export interface ExecuteParams {
  mode: 'puzzle' | 'code'
  codeText: string
  solutionLines: string[]
  isTypeScript: boolean
  testLine: string
  mandatoryLines: string[]
  clue: string
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

export function executePuzzle({
  mode,
  codeText,
  solutionLines,
  isTypeScript,
  testLine,
  mandatoryLines,
  clue,
}: ExecuteParams): ExecuteResult {
  const thisContext: any = {}
  try {
    const fullCode = mode === 'code' ? codeText : solutionLines.join('\n')
    const execCode = prepare(fullCode, isTypeScript)
    const testCode = prepare(testLine, isTypeScript)
    // Execute code and test in the same function scope so test can reference local bindings
    const runAll = new Function('thisContext', '"use strict";\n' + execCode + '\nreturn ( ' + testCode + ' )')
    const success = !!runAll(thisContext)

    const usedMandatory = mandatoryLines.every(line => solutionLines.includes(line))

    if (!usedMandatory) {
      return { result: '✗ missing required lines', success: false, usedMandatory, thisContext }
    }
    if (success) {
      return { result: `✓ ${clue}` , success: true, usedMandatory, thisContext }
    }
    return { result: `✗ ${JSON.stringify(thisContext)}`, success: false, usedMandatory, thisContext }
  } catch (e: any) {
    return { result: `error: ${e?.message ?? String(e)}`, success: false, usedMandatory: false, thisContext }
  }
}
