import { useState, useEffect } from 'react'
import styles from './App.module.css'
import { parsePuzzleCode, replaceThisReferences, type Puzzle, type SolutionLine } from './puzzleUtils'

const PUZZLES: Puzzle[] = [
  {
    id: 1,
    clue: "first two-digit prime",
    code: `
let x = { value: 0 } // @locked
this = x // @locked
this.value = 5
this.value += 6
this.value += 1
this.value *= 2
this.value -= 4
this.value === 11 // @test this.value === _____ // first two-digit prime
    `.trim()
  },
  {
    id: 2,
    clue: "lucky number",
    code: `
let obj = { count: 0 } // @locked
this.count = 7 // @mandatory
this = obj
this.count += 6
this.count *= 2
this.count -= 7
this.count === 13 // @test this.count === _____ // lucky number
    `.trim()
  }
]

type Mode = 'puzzle' | 'code'

function App() {
  const [puzzleIndex, setPuzzleIndex] = useState(0)
  const [solution, setSolution] = useState<SolutionLine[]>([])
  const [mode, setMode] = useState<Mode>('puzzle')
  const [codeText, setCodeText] = useState('')
  const [result, setResult] = useState('')
  const [draggedFromSelected, setDraggedFromSelected] = useState<number | null>(null)
  const [draggedFromAvailable, setDraggedFromAvailable] = useState<string | null>(null)
  const [dropIndicatorIndex, setDropIndicatorIndex] = useState<number | null>(null)

  const puzzle = PUZZLES[puzzleIndex]
  const { lockedLines, mandatoryLines, availableLines, testLine, testDisplay } = parsePuzzleCode(puzzle.code)
  const allAvailableLines = [...mandatoryLines, ...availableLines]

  // Initialize solution with locked lines when puzzle changes
  const initializeSolution = () => {
    const initial: SolutionLine[] = lockedLines.map(locked => ({
      content: locked.content,
      isLocked: true,
      isMandatory: false
    }))
    setSolution(initial)
  }

  useEffect(() => {
    initializeSolution()
  }, [puzzleIndex])

  // Ensure locked lines maintain relative order
  const ensureLockedOrder = (lines: SolutionLine[]): SolutionLine[] => {
    const locked = lines.filter(l => l.isLocked)
    const lockedContents = lockedLines.map(l => l.content)

    // Check if locked lines are in correct order
    let lastLockedIndex = -1
    for (const line of locked) {
      const expectedIndex = lockedContents.indexOf(line.content)
      if (expectedIndex <= lastLockedIndex) {
        // Out of order, need to fix
        const result: SolutionLine[] = []
        let lockedIdx = 0

        for (const line of lines) {
          if (line.isLocked) {
            // Replace with correct locked line
            if (lockedIdx < lockedLines.length) {
              result.push({
                content: lockedLines[lockedIdx].content,
                isLocked: true,
                isMandatory: false
              })
              lockedIdx++
            }
          } else {
            result.push(line)
          }
        }
        return result
      }
      lastLockedIndex = expectedIndex
    }

    return lines
  }

  const addLine = (line: string) => {
    const newLine: SolutionLine = {
      content: line,
      isLocked: false,
      isMandatory: mandatoryLines.includes(line)
    }
    setSolution([...solution, newLine])
  }

  const removeLine = (index: number) => {
    if (solution[index].isLocked) return
    setSolution([
      ...solution.slice(0, index),
      ...solution.slice(index + 1)
    ])
  }

  const clearDragState = () => {
    setDraggedFromSelected(null)
    setDraggedFromAvailable(null)
    setDropIndicatorIndex(null)
  }

  const handleDragStartSelected = (e: React.DragEvent, index: number) => {
    if (solution[index].isLocked) {
      e.preventDefault()
      return
    }
    setDraggedFromSelected(index)
    setDraggedFromAvailable(null)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragStartAvailable = (e: React.DragEvent, line: string) => {
    setDraggedFromAvailable(line)
    setDraggedFromSelected(null)
    e.dataTransfer.effectAllowed = 'copy'
  }

  const handleDragOverSelected = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    setDropIndicatorIndex(index)
  }

  const handleDragOverEmpty = (e: React.DragEvent) => {
    e.preventDefault()
    setDropIndicatorIndex(lockedLines.length)
  }

  const handleDropOnSelected = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault()
    clearDragState()

    if (draggedFromSelected !== null) {
      // Reorder within solution
      const newSolution = [...solution]
      const [draggedLine] = newSolution.splice(draggedFromSelected, 1)
      newSolution.splice(dropIndex, 0, draggedLine)
      setSolution(ensureLockedOrder(newSolution))
    } else if (draggedFromAvailable !== null) {
      // Add from available at position
      const newLine: SolutionLine = {
        content: draggedFromAvailable,
        isLocked: false,
        isMandatory: mandatoryLines.includes(draggedFromAvailable)
      }
      const newSolution = [...solution]
      newSolution.splice(dropIndex, 0, newLine)
      setSolution(ensureLockedOrder(newSolution))
    }
  }

  const handleDropOnEmpty = (e: React.DragEvent) => {
    e.preventDefault()
    clearDragState()

    if (draggedFromAvailable !== null) {
      addLine(draggedFromAvailable)
    }
  }

  const switchToCodeMode = () => {
    const fullCode = solution.map(l => l.content).join('\n')
    setCodeText(fullCode)
    setMode('code')
  }

  const switchFromCodeMode = () => {
    const lines = codeText.split('\n').filter(line => line.trim())
    const newSolution: SolutionLine[] = []

    for (const line of lines) {
      const trimmed = line.trim()
      const isLocked = lockedLines.some(l => l.content === trimmed)
      if (isLocked) {
        newSolution.push({ content: trimmed, isLocked: true, isMandatory: false })
      } else {
        newSolution.push({
          content: trimmed,
          isLocked: false,
          isMandatory: mandatoryLines.includes(trimmed)
        })
      }
    }

    setSolution(ensureLockedOrder(newSolution))
    setMode('puzzle')
  }

  const reset = () => {
    initializeSolution()
    setCodeText('')
    setResult('')
  }

  const nextPuzzle = () => {
    setPuzzleIndex((puzzleIndex + 1) % PUZZLES.length)
    reset()
  }

  const runCode = () => {
    try {
      let thisContext = {}
      const fullCode = mode === 'code'
        ? codeText
        : solution.map(l => l.content).join('\n')

      const execCode = replaceThisReferences(fullCode)
      eval(execCode)

      const testCode = replaceThisReferences(testLine)
      const success = eval(testCode)

      const userLines = solution.filter(l => !l.isLocked).map(l => l.content)
      const usedMandatory = mandatoryLines.every(line => userLines.includes(line))

      if (!usedMandatory) {
        setResult(`✗ missing required lines`)
      } else if (success) {
        setResult(`✓ ${puzzle.clue}`)
      } else {
        setResult(`✗ ${JSON.stringify(thisContext)}`)
      }
    } catch (e: any) {
      setResult(`error: ${e.message}`)
    }
  }

  const getLineClassName = (line: SolutionLine) => {
    if (line.isLocked) return styles.lockedItem
    if (line.isMandatory) return styles.mandatorySolutionItem
    return styles.solutionItem
  }

  return (
    <div className={styles.app}>
      <div className={styles.header}>
        <h1>this.puzzle</h1>
        <button
          className={mode === 'code' ? styles.codeToggle : styles.codeToggleInactive}
          onClick={() => mode === 'puzzle' ? switchToCodeMode() : switchFromCodeMode()}
        >
          {mode === 'puzzle' ? 'code mode' : 'puzzle mode'}
        </button>
      </div>

      <div className={styles.clueBox}>
        <span className={styles.clueLabel}>clue:</span> {puzzle.clue}
      </div>

      {mode === 'code' ? (
        <div className={styles.codeMode}>
          <div className={styles.codeWrapper}>
            <div className={styles.editorSection}>
              <div className={styles.editorHeader}>code</div>
              <div className={styles.editorContent}>
                <div className={styles.lineNumbers}>
                  {codeText.split('\n').map((_, i) => {
                    const line = codeText.split('\n')[i]
                    const isLocked = lockedLines.some(l => l.content === line.trim())
                    return (
                      <div
                        key={i}
                        className={isLocked ? styles.lockedLineNum : ''}
                      >
                        {i + 1}
                      </div>
                    )
                  })}
                </div>
                <div className={styles.codeTextArea}>
                  <div className={styles.syntaxOverlay}>
                    {codeText.split('\n').map((line, i) => {
                      const isLocked = lockedLines.some(l => l.content === line.trim())
                      const isMandatory = mandatoryLines.includes(line.trim())
                      return (
                        <div
                          key={i}
                          className={isLocked ? styles.lockedSyntax : (isMandatory ? styles.mandatorySyntax : '')}
                        >
                          {line || ' '}
                        </div>
                      )
                    })}
                  </div>
                  <textarea
                    className={styles.codeInput}
                    value={codeText}
                    onChange={(e) => setCodeText(e.target.value)}
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>

            <div className={styles.sidePanel}>
              <div className={styles.testSection}>
                <div className={styles.editorHeader}>test</div>
                <div className={styles.testDisplay}>{testDisplay}</div>
              </div>

              <div className={styles.outputSection}>
                <div className={styles.editorHeader}>output</div>
                <div className={styles.outputContent}>
                  {result && (
                    <div className={result.startsWith('✓') ? styles.success : styles.failure}>
                      {result}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button onClick={runCode}>run</button>
            <button onClick={reset}>reset</button>
            <button onClick={nextPuzzle}>next</button>
          </div>
        </div>
      ) : (
        <>
          <div className={styles.puzzleGrid}>
            <div className={styles.gridColumn}>
              <div className={styles.sectionHeader}>available</div>
              <div className={styles.availableBox}>
                {allAvailableLines.map((line, i) => {
                  const isMandatory = mandatoryLines.includes(line)
                  const isUsed = solution.some(s => s.content === line && !s.isLocked)
                  return (
                    <div
                      key={i}
                      className={`${styles.availableItem} ${isMandatory ? styles.mandatoryItem : ''} ${isUsed ? styles.usedItem : ''}`}
                      draggable={!isUsed}
                      onDragStart={(e) => !isUsed && handleDragStartAvailable(e, line)}
                      onDragEnd={clearDragState}
                      onClick={() => !isUsed && addLine(line)}
                    >
                      {isMandatory && <span className={styles.requiredBadge}>!</span>}
                      {line}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className={styles.gridColumn}>
              <div className={styles.sectionHeader}>your solution</div>
              <div className={styles.solutionBox}>
                {solution.length === 0 ? (
                  <div
                    className={styles.emptyPrompt}
                    onDragOver={handleDragOverEmpty}
                    onDrop={handleDropOnEmpty}
                    onDragLeave={() => setDropIndicatorIndex(null)}
                  >
                    click or drag lines here
                  </div>
                ) : (
                  <>
                    {solution.map((line, i) => (
                      <div key={i}>
                        {dropIndicatorIndex === i && (
                          <div className={styles.dropLine} />
                        )}
                        <div
                          className={`${getLineClassName(line)} ${
                            draggedFromSelected === i ? styles.dragging : ''
                          }`}
                          draggable={!line.isLocked}
                          onDragStart={(e) => handleDragStartSelected(e, i)}
                          onDragOver={(e) => handleDragOverSelected(e, i)}
                          onDragLeave={() => setDropIndicatorIndex(null)}
                          onDrop={(e) => handleDropOnSelected(e, i)}
                          onDragEnd={clearDragState}
                        >
                          <div className={styles.solutionContent}>
                            <span className={line.isLocked ? styles.lockedLineNum : styles.solutionLineNum}>
                              {i + 1}
                            </span>
                            {line.content}
                          </div>
                          {!line.isLocked && (
                            <button
                              className={styles.removeButton}
                              onClick={() => removeLine(i)}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {dropIndicatorIndex === solution.length && (
                      <div className={styles.dropLine} />
                    )}
                    <div
                      className={styles.dropZone}
                      onDragOver={(e) => {
                        e.preventDefault()
                        setDropIndicatorIndex(solution.length)
                      }}
                      onDrop={(e) => handleDropOnSelected(e, solution.length)}
                      onDragLeave={() => setDropIndicatorIndex(null)}
                    />
                  </>
                )}
              </div>
            </div>

            <div className={styles.gridColumn}>
              <div className={styles.sectionHeader}>test</div>
              <div className={styles.testBox}>
                {testDisplay}
              </div>

              <div className={styles.sectionHeader} style={{ marginTop: 24 }}>output</div>
              <div className={styles.outputBox}>
                {result && (
                  <div className={result.startsWith('✓') ? styles.success : styles.failure}>
                    {result}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            <button onClick={runCode}>run</button>
            <button onClick={reset}>reset</button>
            <button onClick={nextPuzzle}>next</button>
          </div>
        </>
      )}
    </div>
  )
}

export default App
