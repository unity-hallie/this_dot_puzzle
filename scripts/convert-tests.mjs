#!/usr/bin/env node
import { globby } from 'globby'
import fs from 'node:fs/promises'
import path from 'node:path'

const mode = process.argv.includes('--write') ? 'write' : 'plan'

function convertToAssert(code) {
  const lines = code.split('\n')
  const out = []
  for (const raw of lines) {
    const m = raw.match(/^\s*(.+?)\s*\/\/\s*@test\s+(.+)$/)
    if (m) {
      const expr = m[1].trim()
      const display = m[2].trim()
      out.push(`// @assert ${expr} // ${display}`)
    } else {
      out.push(raw)
    }
  }
  return out.join('\n')
}

async function run() {
  const files = await globby('src/puzzles/**/*.ts')
  let changed = 0
  for (const file of files) {
    const src = await fs.readFile(file, 'utf8')
    if (!src.includes('@test')) continue
    const next = convertToAssert(src)
    if (next !== src) {
      changed++
      if (mode === 'write') {
        const outPath = path.join(path.dirname(file), path.basename(file))
        await fs.writeFile(outPath, next, 'utf8')
        console.log(`converted: ${file}`)
      } else {
        console.log(`[plan] would convert: ${file}`)
      }
    }
  }
  console.log(`${mode === 'write' ? 'Converted' : 'Planned'}: ${changed} file(s)`) 
}

run().catch((e) => { console.error(e); process.exit(1) })

