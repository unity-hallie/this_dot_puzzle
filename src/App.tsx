import { useState, useEffect } from 'react'
import type React from 'react'
import styles from './App.module.css'
import { parsePuzzleCode, ensureLockedOrder, type Puzzle, type SolutionLine } from './puzzleUtils'
import { executePuzzle } from './exec'
import { LEVELS, type Level } from './puzzles'
import AISettings from './components/AISettings'
import PuzzleGenerator from './components/PuzzleGenerator'

type View = 'menu' | 'level-select' | 'puzzle'
type Mode = 'puzzle' | 'code'

function App() {
  const [view, setView] = useState<View>('menu')
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null)
  const [selectedPuzzle, setSelectedPuzzle] = useState<Puzzle | null>(null)
  const [solution, setSolution] = useState<SolutionLine[]>([])
  const [mode, setMode] = useState<Mode>('puzzle')
  const [codeText, setCodeText] = useState('')
  const [result, setResult] = useState('')
  const [draggedFromSelected, setDraggedFromSelected] = useState<number | null>(null)
  const [draggedFromAvailable, setDraggedFromAvailable] = useState<string | null>(null)
  const [dropIndicatorIndex, setDropIndicatorIndex] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [progress, setProgress] = useState<Record<string, boolean>>(() => {
    try {
      const raw = localStorage.getItem('this_puzzle_progress_v1')
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })
  const [showAISettings, setShowAISettings] = useState(false)
  const [showPuzzleGenerator, setShowPuzzleGenerator] = useState(false)

  const puzzle = selectedPuzzle
  const { lockedLines, mandatoryLines, availableLines, testLine, testDisplay } = puzzle
    ? parsePuzzleCode(puzzle.code)
    : { lockedLines: [], mandatoryLines: [], availableLines: [], testLine: '', testDisplay: '' }
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
    if (selectedPuzzle) {
      initializeSolution()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPuzzle])

  const transitionTo = (newView: View, callback?: () => void) => {
    setIsTransitioning(true)
    setTimeout(() => {
      if (callback) callback()
      setView(newView)
      setTimeout(() => setIsTransitioning(false), 50)
    }, 200)
  }

  const goToMenu = () => {
    transitionTo('menu', () => {
      setSelectedLevel(null)
      setSelectedPuzzle(null)
      reset()
    })
  }

  const selectLevel = (level: Level) => {
    transitionTo('level-select', () => {
      setSelectedLevel(level)
    })
  }

  const selectPuzzle = (puzzle: Puzzle) => {
    transitionTo('puzzle', () => {
      setSelectedPuzzle(puzzle)
      reset()
    })
  }

  // Helper that applies library ensureLockedOrder using current locked contents
  const ensureLocked = (lines: SolutionLine[]) => (
    ensureLockedOrder(lines, lockedLines.map(l => l.content))
  )

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
    try {
      // Required in some browsers to initiate drag
      e.dataTransfer.setData('text/plain', solution[index].content)
    } catch {}
  }

  const handleDragStartAvailable = (e: React.DragEvent, line: string) => {
    setDraggedFromAvailable(line)
    setDraggedFromSelected(null)
    e.dataTransfer.effectAllowed = 'copy'
    try {
      // Required in some browsers (e.g., Safari/Firefox) to start drag
      e.dataTransfer.setData('text/plain', line)
    } catch {}
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
    const fromSelected = draggedFromSelected
    const fromAvailable = draggedFromAvailable

    if (fromSelected !== null) {
      // Reorder within solution
      const newSolution = [...solution]
      const [draggedLine] = newSolution.splice(fromSelected, 1)
      newSolution.splice(dropIndex, 0, draggedLine)
      setSolution(ensureLocked(newSolution))
    } else if (fromAvailable !== null) {
      // Add from available at position
      const newLine: SolutionLine = {
        content: fromAvailable,
        isLocked: false,
        isMandatory: mandatoryLines.includes(fromAvailable)
      }
      const newSolution = [...solution]
      newSolution.splice(dropIndex, 0, newLine)
      setSolution(ensureLocked(newSolution))
    }
    clearDragState()
  }

  const handleDropOnEmpty = (e: React.DragEvent) => {
    e.preventDefault()
    const fromAvailable = draggedFromAvailable
    if (fromAvailable !== null) {
      addLine(fromAvailable)
    }
    clearDragState()
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

    setSolution(ensureLocked(newSolution))
    setMode('puzzle')
  }

  const reset = () => {
    initializeSolution()
    setCodeText('')
    setResult('')
  }

  const nextPuzzle = () => {
    if (!selectedLevel || !selectedPuzzle) return

    const currentIndex = selectedLevel.puzzles.findIndex(p => p.id === selectedPuzzle.id)
    const nextIndex = currentIndex + 1

    if (nextIndex < selectedLevel.puzzles.length) {
      selectPuzzle(selectedLevel.puzzles[nextIndex])
    } else {
      // Go back to level select if no more puzzles
      transitionTo('level-select')
    }
  }

  const runCode = () => {
    if (!puzzle) return
    const isTypeScript = puzzle.language === 'typescript'
    // Extract hidden variables and clue
    const hiddenVars = puzzle.hidden_vars?.[0]?.vars || {}
    const clue = puzzle.hidden_vars?.[0]?.hint || puzzle.clue || ''

    const { result } = executePuzzle({
      mode,
      codeText,
      solutionLines: solution.map(l => l.content),
      isTypeScript,
      testLine,
      mandatoryLines,
      clue,
      hiddenVars,
    })
    setResult(result)
    if (result.startsWith('✓') && puzzle?.id) {
      const pid = String(puzzle.id)
      if (!progress[pid]) {
        const next = { ...progress, [pid]: true }
        setProgress(next)
        try { localStorage.setItem('this_puzzle_progress_v1', JSON.stringify(next)) } catch {}
      }
    }
  }

  const getLineClassName = (line: SolutionLine) => {
    if (line.isLocked) return styles.lockedItem
    if (line.isMandatory) return styles.mandatorySolutionItem
    return styles.solutionItem
  }

  const handleGeneratedPuzzle = (puzzle: Puzzle) => {
    setShowPuzzleGenerator(false)
    // Auto-select the generated puzzle
    selectPuzzle(puzzle)
  }

  // Main Menu View
  if (view === 'menu') {
    return (
      <div className={`${styles.app} ${isTransitioning ? styles.transitioning : ''}`}>
        <div className={styles.menuContainer}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h1 className={styles.menuTitle}>this.puzzle</h1>
              <p className={styles.menuSubtitle}>Learn JavaScript context through puzzles</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setShowPuzzleGenerator(true)}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                ✨ Generate Puzzle
              </button>
              <button
                onClick={() => setShowAISettings(true)}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                ⚙️ AI Settings
              </button>
            </div>
          </div>
          <div className={styles.levelGrid}>
            {LEVELS.map((level) => {
              const completed = level.puzzles.filter(p => progress[String(p.id)]).length
              return (
              <button
                key={level.id}
                className={styles.levelCard}
                onClick={() => selectLevel(level)}
              >
                <h2>{level.title}</h2>
                <p>{level.description}</p>
                <span className={styles.puzzleCount}>{completed}/{level.puzzles.length} completed</span>
                {level.legacy && (
                  <span className={styles.legacyBadge}>LEGACY</span>
                )}
              </button>
            )})}
          </div>
        </div>
      </div>
    )
  }

  // Level Select View
  if (view === 'level-select' && selectedLevel) {
    return (
      <div className={`${styles.app} ${isTransitioning ? styles.transitioning : ''}`}>
        <div className={styles.menuContainer}>
          <button className={styles.backButton} onClick={goToMenu}>← Back to Levels</button>
          <h1 className={styles.menuTitle}>{selectedLevel.title}</h1>
          <p className={styles.menuSubtitle}>{selectedLevel.description}</p>
          <div className={styles.puzzleGrid}>
            {selectedLevel.puzzles.map((puzzle, index) => {
              const clueText = puzzle.hidden_vars?.[0]?.hint || puzzle.clue || ''
              return (
              <button
                key={puzzle.id}
                className={styles.puzzleCard}
                onClick={() => selectPuzzle(puzzle)}
              >
                <span className={styles.puzzleNumber}>{index + 1}</span>
                <h3>{puzzle.title}</h3>
                <p>{clueText}</p>
                {puzzle.language === 'typescript' && (
                  <span className={styles.tsTag}>TS</span>
                )}
                {puzzle.legacy && (
                  <span className={styles.legacyPuzzleBadge}>LEGACY</span>
                )}
                {progress[String(puzzle.id)] && (
                  <span className={styles.doneTag}>✓</span>
                )}
              </button>
            )})}
          </div>
        </div>
      </div>
    )
  }

  // Puzzle View
  if (!puzzle) return null

  return (
    <div className={`${styles.app} ${isTransitioning ? styles.transitioning : ''}`}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => transitionTo('level-select')}>
          ← Back
        </button>
        <h1>this.puzzle</h1>
        <button
          className={mode === 'code' ? styles.codeToggle : styles.codeToggleInactive}
          onClick={() => mode === 'puzzle' ? switchToCodeMode() : switchFromCodeMode()}
        >
          {mode === 'puzzle' ? 'code mode' : 'puzzle mode'}
        </button>
      </div>

      {/* Clue hidden until success - shown only in result message */}

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
                    {testLine && (
                      <div className={styles.testSyntax}>{testLine}</div>
                    )}
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
                  const isTest = line.includes('@test')
                  return (
                    <div
                      key={i}
                      className={`${styles.availableItem} ${isMandatory ? styles.mandatoryItem : ''} ${isUsed ? styles.usedItem : ''}`}
                      draggable={!isUsed}
                      onDragStart={(e) => !isUsed && handleDragStartAvailable(e, line)}
                      onDragEnd={clearDragState}
                      onClick={() => !isUsed && addLine(line)}
                    >
                      {isTest && <span className={styles.testBadge}>test</span>}
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
                            {line.content.includes('@test') && (
                              <span className={styles.testBadge} style={{ marginRight: 6 }}>test</span>
                            )}
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

      {/* AI Modals */}
      {showAISettings && <AISettings onClose={() => setShowAISettings(false)} />}
      {showPuzzleGenerator && <PuzzleGenerator onGenerated={handleGeneratedPuzzle} />}
    </div>
  )
}

export default App
