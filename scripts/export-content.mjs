import ts from 'typescript'
import { mkdtempSync, readFileSync, writeFileSync, rmSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createRequire } from 'node:module'

const directory = mkdtempSync(join(tmpdir(), 'cv-export-'))
try {
  writeFileSync(join(directory, 'package.json'), '{"type":"commonjs"}')
  for (const name of ['content', 'architecture', 'profiles']) {
    const source = readFileSync(`src/${name}.ts`, 'utf8')
    writeFileSync(join(directory, `${name}.js`), ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText)
  }
  const { profiles } = createRequire(import.meta.url)(join(directory, 'profiles.js'))
  mkdirSync('.cv-build', { recursive: true })
  writeFileSync('.cv-build/profiles.json', JSON.stringify(profiles))
} finally {
  rmSync(directory, { recursive: true, force: true })
}
