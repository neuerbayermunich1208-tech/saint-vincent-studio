#!/usr/bin/env node
/**
 * Fails when public-facing source or translations contain wording the brand never uses.
 * Scans: messages/, src/ (excluding generated types), public/ text files.
 * See BRAND_GUIDELINES.md. Run: npm run check:brand
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, extname, resolve, sep } from 'node:path'
import { pathToFileURL } from 'node:url'

export const BANNED = [
  /3\s*d[\s-]*print(ing|ed)?\s*(service|products?|shop|farm)?/i,
  /d[ịi]ch\s+v[ụu]\s+in\s+3\s*d/i,
  /nh[ậa]n\s+in\s+3\s*d/i,
  /x[ưu][ởo]ng\s+in\s+3\s*d/i,
  /\bin\s+3\s*d\b/i,
]

const ROOTS = ['messages', 'src', 'public']
const SKIP = new Set(['payload-types.ts', 'importMap.js'])
const EXT = new Set(['.ts', '.tsx', '.json', '.md', '.txt', '.css', '.js', '.mjs', '.html', '.svg', '.xml'])
// This file and the test that checks it must name the banned terms.
const SELF = ['scripts/check-brand-language.mjs']

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) walk(p, out)
    else if (EXT.has(extname(name)) && !SKIP.has(name)) out.push(p)
  }
  return out
}

export function findViolations(text) {
  return BANNED.filter((re) => re.test(text)).map((re) => re.source)
}

// pathToFileURL keeps this working on Windows too (a plain `file://${argv[1]}` never matches there).
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const problems = []
  for (const root of ROOTS) {
    for (const file of walk(root)) {
      if (SELF.includes(file.split(sep).join('/'))) continue
      const lines = readFileSync(file, 'utf8').split('\n')
      lines.forEach((line, i) => {
        const hits = findViolations(line)
        if (hits.length) problems.push(`${file}:${i + 1}  ${line.trim().slice(0, 120)}`)
      })
    }
  }
  if (problems.length) {
    console.error('Banned brand wording found:\n' + problems.join('\n'))
    process.exit(1)
  }
  console.log('Brand language check passed.')
}
