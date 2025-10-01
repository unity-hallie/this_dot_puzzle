import type { Puzzle } from '../puzzleUtils'

// Import all puzzles
import basics01 from './01-basics/01-first-touch'
import basics02 from './01-basics/02-two-steps'
import basics03 from './01-basics/03-do-addition'
import basics04 from './01-basics/04-the-shortcut'
import basics05 from './01-basics/05-more-operators'
import basics06 from './01-basics/06-the-plan'
import context01 from './02-context/01-switch'
import context02 from './02-context/02-juggle'
import types01 from './03-types/01-interface'
import types02 from './03-types/02-typed-props'
import types03 from './03-types/03-generic-wrap'
import types04 from './03-types/04-in-middle'
import closures01 from './04-closures/01-counter'
import closures02 from './04-closures/02-adder'
import arrows01 from './05-arrows/01-implicit-return'
import arrows02 from './05-arrows/02-map-capture'
import weird01 from './06-weird-js/01-object-is-negzero'
import weird02 from './06-weird-js/02-truthy-array'
import ops01 from './07-operators/01-ternary'
import ops02 from './07-operators/02-nullish-coalesce'
import ops03 from './07-operators/03-optional-chaining'
import ops04 from './07-operators/04-combined-choice'
import ops05 from './07-operators/05-short-circuit'
import ops06 from './07-operators/06-nullish-vs-or'
import ops07 from './07-operators/07-nested-ternary'
import ops08 from './07-operators/08-optional-call-coalesce'

export interface LearningObjective {
  id: string
  description: string
  assessed_in: string[]
}

export interface Level {
  id: string
  title: string
  description: string
  puzzles: Puzzle[]
  learning_objectives?: LearningObjective[]
  designer_notes?: string
  legacy?: boolean
}

export const LEVELS: Level[] = [
  {
    id: '01-basics',
    title: 'Basics',
    description: 'Learn how this works',
    puzzles: [basics01, basics02, basics03, basics04, basics05, basics06],
    learning_objectives: [
      {
        id: 'this-binding',
        description: 'Understand that `this` refers to an object',
        assessed_in: ['basics-1', 'basics-2', 'basics-3']
      },
      {
        id: 'code-sequencing',
        description: 'Code runs line-by-line; order matters',
        assessed_in: ['basics-2', 'basics-6']
      },
      {
        id: 'compound-assignment',
        description: 'Use +=, *= operators',
        assessed_in: ['basics-4', 'basics-5', 'basics-6']
      },
      {
        id: 'multi-step-planning',
        description: 'Plan a sequence of operations to reach a goal',
        assessed_in: ['basics-6']
      }
    ],
    designer_notes: `
Distractor Philosophy (Miyamoto Principle):
- Include distractors when wrong answer teaches something specific
- Make failures clear, informative, and recoverable
- Use distractors that are plausible mistakes someone would make
- DON'T include random "gotchas" or confusing syntax
- Both success AND failure should teach the concept

Examples in this level:
- basics-4: Both lines work → teaches equivalence
- basics-5: *= 3 gives 21 → teaches operator choice matters
- basics-6: += 10 gives 30 → teaches planning ahead matters
    `.trim()
  },
  {
    id: '02-context',
    title: 'Context',
    description: 'Switch between contexts',
    puzzles: [context01, context02],
    legacy: true
  },
  {
    id: '03-types',
    title: 'Types',
    description: 'TypeScript puzzles',
    puzzles: [types01, types02, types03, types04],
    legacy: true
  },
  {
    id: '04-closures',
    title: 'Closures',
    description: 'Capture and remember state',
    puzzles: [closures01, closures02],
    legacy: true
  },
  {
    id: '05-arrows',
    title: 'Arrows',
    description: 'Concise syntax and lexical capture',
    puzzles: [arrows01, arrows02],
    legacy: true
  },
  {
    id: '06-weird',
    title: 'Weird JS',
    description: 'Edge cases and gotchas',
    puzzles: [weird01, weird02],
    legacy: true
  },
  {
    id: '07-operators',
    title: 'Weird Operators',
    description: 'Ternary, nullish, optional chaining',
    puzzles: [ops01, ops02, ops03, ops04, ops05, ops06, ops07, ops08],
    legacy: true
  }
]
