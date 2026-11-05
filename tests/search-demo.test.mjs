import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import ts from 'typescript'
const source=readFileSync(new URL('../src/lib/searchDemo.ts',import.meta.url),'utf8')
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ES2022,target:ts.ScriptTarget.ES2022}}).outputText
const {similarity,wordSimilarity,trigrams}=await import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`)
test('trigram matching tolerates English and Russian typos without matching unrelated text',()=>{
 for(const [typo,word] of [['aplication','Application'],['архитектра','Архитектура'],['databse','Database'],['оптимизаця','Оптимизация']]){
  assert.ok(similarity(typo,word)>=.3)
  assert.ok(!word.toLowerCase().includes(typo))
 }
 assert.equal(wordSimilarity('aplication','Зимний отпуск'),0)
 assert.equal(similarity('',''),0)
 assert.equal(similarity('SQL','sql'),1)
 assert.ok(trigrams('приложение').has('при'))
})
