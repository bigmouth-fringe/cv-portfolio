import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

test('download export includes every registered CV in both languages without private source fields', () => {
  execFileSync(process.execPath, ['scripts/export-content.mjs'])
  const profiles = JSON.parse(readFileSync('.cv-build/profiles.json', 'utf8'))
  for (const profile of profiles) {
    assert.match(profile.downloadName, /^[A-Za-z0-9_]+$/)
    for (const lang of ['en', 'ru']) {
      const cv = profile.content[lang]
      assert.equal(cv.jobs.length, 4)
      assert.equal(cv.jobs.reduce((sum, job) => sum + job.bullets.length, 0), 21)
      assert.ok(cv.aboutParagraphs.length)
      assert.ok(profile.toolkit.flatMap(group => group.skills).includes('Npgsql'))
    }
    assert.equal('phone' in profile, false)
    assert.equal('birthDate' in profile, false)
  }
})
