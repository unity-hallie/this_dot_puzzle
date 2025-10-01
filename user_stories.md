# User Stories

## Core Concept
An educational puzzle game that teaches JavaScript `this` context through interactive code puzzles. Players arrange code lines to make tests pass, learning by figuring out rules through context (like crosswords).

## Player Experience

### Learning Through Puzzles
- **As a learner**, I want to solve puzzles that teach me JavaScript concepts by context, so I can learn by doing rather than reading documentation
- **As a learner**, I want a welcoming, crossword-like interface (not dark/menacing), so I feel comfortable experimenting and learning
- **As a learner**, I want puzzles to start simple and gradually add complexity, so I can build understanding progressively

### Building Solutions
- **As a player**, I want to see a clue that hints at the goal value (e.g., "first two-digit prime"), so I understand what I'm solving for
- **As a player**, I want to drag code lines from "available" into my solution, so I can build my answer interactively
- **As a player**, I want to click code lines as an alternative to dragging, so I can use whichever interaction feels natural
- **As a player**, I want to reorder lines within my solution by dragging, so I can experiment with different arrangements
- **As a player**, I want to insert lines at any position (including between locked lines), so I have full control over solution structure
- **As a player**, I want to remove lines from my solution, so I can undo mistakes

### Understanding Constraints
- **As a player**, I want to see locked lines (purple) that maintain their relative order, so I understand the fixed structure I'm working within
- **As a player**, I want to see mandatory lines (orange with "!") that must be included, so I know which lines are required for the solution
- **As a player**, I want to see optional lines (blue), so I can choose additional lines to complete the puzzle
- **As a player**, I want locked lines to maintain relative order but allow me to insert other lines between them, so the structure is flexible but predictable
- **As a player**, I want visual feedback showing which available lines I've already used, so I don't get confused about my selections

### Testing Solutions
- **As a player**, I want to see the test condition with masked values (e.g., `this.value === _____ // first two-digit prime`), so I can see what's being tested without seeing the answer
- **As a player**, I want to run my code and see if it passes or fails, so I get immediate feedback
- **As a player**, I want to see success messages when my solution passes (e.g., "✓ first two-digit prime"), so I feel rewarded for solving the puzzle
- **As a player**, I want to see helpful error messages when my solution fails, so I can debug my approach
- **As a player**, I want to be told if I'm missing required lines, so I know when I've overlooked a constraint

### Advanced Features
- **As a player**, I want a "code mode" where I can edit the solution as freeform text, so I can "fuck it we ball" and experiment freely
- **As a player**, I want to switch between puzzle mode and code mode, so I can use whichever approach suits my current needs
- **As a player**, I want syntax highlighting in code mode that shows locked/mandatory/optional lines, so I understand constraints even in freeform editing
- **As a player**, I want to reset my solution to start over, so I can try a fresh approach
- **As a player**, I want to move to the next puzzle, so I can continue learning

## Technical Learning Goals

### JavaScript `this` Context
- **As a learner**, I want puzzles that use `this.value` and similar patterns, so I learn how `this` works in JavaScript
- **As a learner**, I want to see how variable assignments affect `this`, so I understand context binding
- **As a learner**, I want progressively complex puzzles with scopes and contexts, so I build deep understanding over time

### Mathematical Problem Solving
- **As a learner**, I want puzzles that combine code logic with math (e.g., "make this.value equal the first two-digit prime"), so I exercise both programming and problem-solving skills
- **As a learner**, I want to see how different operations (+=, *=, -=) affect values, so I understand operator behavior

## Design Principles

### Interface
- Light, welcoming theme (like crosswords/sudoku, not menacing)
- Three distinct visual styles for locked/mandatory/optional lines
- Clear drag-and-drop indicators showing where lines will be placed
- Support both drag-and-drop AND click interactions without mode switching

### Data Structure
- Puzzles defined as unified code blocks with comment markers (`// @locked`, `// @mandatory`, `// @test`)
- Test lines show masked display text instead of actual test code
- Code should be valid JavaScript that runs as-is in the puzzle definition

### Safety
- All code execution is local (using eval() is acceptable since user controls all input)
- No external API calls or data persistence needed
