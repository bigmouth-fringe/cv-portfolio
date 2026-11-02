import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createRequire } from 'node:module'
import ts from 'typescript'

// Compile only the registry and content into an isolated CommonJS directory.
const directory = mkdtempSync(join(tmpdir(), 'portfolio-tests-'))
writeFileSync(join(directory, 'package.json'), '{"type":"commonjs"}')
for (const name of ['content', 'profiles']) {
  const source = readFileSync(new URL(`../src/${name}.ts`, import.meta.url), 'utf8')
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } })
  writeFileSync(join(directory, `${name}.js`), outputText)
}
const { profiles, resolveProfile, readProfileId } = createRequire(import.meta.url)(join(directory, 'profiles.js'))
process.on('exit', () => rmSync(directory, { recursive: true, force: true }))
const second = { ...profiles[0], id: 'another-cv', email: 'other@example.com', label: { en: 'Another CV', ru: 'Другое резюме' } }

test('a second registered CV can be resolved independently of the first', () => {
  assert.equal(resolveProfile(second.id, [...profiles, second]), second)
  assert.equal(resolveProfile('missing', [...profiles, second]), profiles[0])
  assert.throws(() => resolveProfile(null, []), /At least one/)
})
test('explicit URL selection takes priority over remembered selection', () => {
  profiles.push(second)
  globalThis.window = { location: { search: '?cv=another-cv' } }
  globalThis.localStorage = { getItem: () => profiles[0].id }
  assert.equal(readProfileId(), second.id)
  window.location.search = ''
  localStorage.getItem = () => second.id
  assert.equal(readProfileId(), second.id)
  window.location.search = '?cv=deleted-profile'
  assert.equal(readProfileId(), profiles[0].id)
  profiles.pop()
})
test('unavailable browser storage falls back safely', () => {
  window.location.search = ''
  localStorage.getItem = () => { throw new Error('Storage blocked') }
  assert.equal(readProfileId(), profiles[0].id)
})
test('published profiles have unique URL-safe IDs and both translations', () => {
  assert.equal(new Set(profiles.map(profile => profile.id)).size, profiles.length)
  for (const profile of profiles) {
    assert.match(profile.id, /^[a-z0-9-]+$/)
    for (const lang of ['en', 'ru']) {
      assert.ok(profile.label[lang])
      assert.ok(profile.content[lang].name)
      assert.ok(profile.content[lang].role)
      assert.ok(profile.description[lang])
    }
  }
})
