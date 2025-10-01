# Documentation TODO

## ✅ Completed
- [x] **Claude.md** - Comprehensive AI-assistant and developer documentation
  - Architecture overview
  - File structure
  - Development workflows
  - Puzzle system internals
  - Extension patterns

## 📝 Documentation Needs

### High Priority

1. **API Documentation**
   - Add JSDoc comments to `src/puzzleUtils.ts` public functions
   - Document `src/exec.ts` execution model and security boundaries
   - Add inline comments explaining `thisContext` transformation logic

2. **Component Documentation**
   - Add prop types documentation to `App.tsx` components
   - Document state management patterns and data flow
   - Explain drag-and-drop implementation details

3. **Puzzle Authoring Guide**
   - Create `docs/puzzle-authoring.md` with:
     - Step-by-step guide for creating puzzles
     - Best practices for clues and test expressions
     - Common pitfalls and how to avoid them
     - Examples of good vs. bad puzzles
     - LLM prompt templates

### Medium Priority

4. **Testing Documentation**
   - Document test strategy in `src/test/README.md`
   - Add comments to `src/puzzleValidation.ts` explaining validation logic
   - E2E test patterns in `e2e/README.md`
   - Coverage expectations and goals

5. **Configuration Files**
   - Add comments to `vitest.config.ts` explaining coverage setup
   - Document `playwright.config.ts` settings
   - Explain `eslint.config.js` custom rules
   - Document `.prettierrc.json` choices

6. **Scripts Documentation**
   - Add header comments to `scripts/convert-tests.mjs`:
     - Purpose: Future migration from `@test` to `@assert`
     - Usage: `node scripts/convert-tests.mjs [--write]`
     - When to use it (migration timeline TBD)

7. **CSS Architecture**
   - Add comments to `src/App.module.css` explaining:
     - Color scheme choices (locked=purple, mandatory=orange, etc.)
     - Layout strategy (grid/flex patterns)
     - Animation/transition patterns
     - Responsive design approach

### Low Priority

8. **Deployment Documentation**
   - Create `docs/deployment.md` with:
     - Build process details
     - Static hosting setup (Vercel, Netlify, etc.)
     - Environment variables (if any)
     - Performance optimization tips

9. **Contributing Guide**
   - Create `CONTRIBUTING.md` with:
     - Code style guidelines
     - Pull request process
     - Community puzzle submission workflow
     - Review criteria

10. **User Documentation**
    - Create `docs/user-guide.md` or in-app help:
      - How to play
      - UI controls explanation
      - Tips for solving puzzles
      - Understanding error messages

11. **Architecture Decision Records (ADRs)**
    - Why React over other frameworks
    - Why Vite over webpack/parcel
    - Why `new Function()` for code execution vs. safer sandboxes
    - Why inline `@test` vs. separate test files
    - Why localStorage for progress tracking

## 🔮 Future Documentation

12. **Roadmap Documentation**
    - Async puzzle support design
    - Multiplayer/collaborative features
    - Mobile app considerations
    - Localization/i18n strategy

13. **API/SDK for External Puzzles**
    - If community puzzle submissions become a thing:
      - Puzzle validation API
      - Submission format spec
      - Security guidelines

## 📋 Code Comments Needed

### Specific Files

- `src/puzzleUtils.ts:57-76` - `replaceThisReferences()`
  - Document regex patterns and limitations
  - Explain why string/comment parsing is intentionally skipped

- `src/exec.ts:27-41` - `transformInlineTests()`
  - Document `__assert` transformation logic
  - Explain how failures are collected

- `src/App.tsx:85-88` - `ensureLocked()`
  - Explain locked-line ordering algorithm

- `src/puzzleValidation.ts` (entire file)
  - Header comment explaining purpose (validate all puzzles pass their own tests)
  - When to run it (CI pipeline? manual checks?)

## 🎯 Inline Comment Standards

Going forward, prefer:
- JSDoc for public APIs
- Brief inline comments for non-obvious logic
- Function header comments for complex algorithms
- Type annotations over comments (TypeScript FTW)

## 🔗 Cross-References Needed

- Link README.md to Claude.md for AI assistants
- Link README.md to future puzzle-authoring.md
- Add "see also" sections between related docs
- Create docs index/table of contents if docs grow large

## 🧹 Cleanup Tasks

- Remove or document any dead code
- Clarify TODOs in codebase (if any exist)
- Update user_stories.md to reflect implemented features
- Archive old/unused files or add "deprecated" notes
