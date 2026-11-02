import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, writeFileSync, rmSync, realpathSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, sep } from 'node:path'
import { createRequire } from 'node:module'
import ts from 'typescript'

const temporaryRoot=realpathSync(tmpdir())
const directory=mkdtempSync(join(temporaryRoot,'gantt-tests-'))
writeFileSync(join(directory,'package.json'),'{"type":"commonjs"}')
const source=readFileSync(new URL('../src/lib/gantt.ts',import.meta.url),'utf8')
writeFileSync(join(directory,'gantt.js'),ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)
const {schedule,minimumStart,initialTasks,initialLinks}=createRequire(import.meta.url)(join(directory,'gantt.js'))
process.on('exit',()=>{if(realpathSync(directory).startsWith(temporaryRoot+sep))rmSync(directory,{recursive:true,force:true})})

for(const [type,expected] of [['FS',9],['SS',5],['FF',6],['SF',2]]){
  test(`${type} enforces the correct pair of anchors and signed lag`,()=>{
    const a={id:'a',start:5,duration:4},b={id:'b',start:-20,duration:3}
    const link={id:'link',from:'a',to:'b',type,lag:0}
    assert.equal(minimumStart(a,b,link),expected)
    assert.equal(schedule([a,b],[link])[1].start,expected)
    assert.equal(schedule([a,b],[{...link,lag:2}])[1].start,expected+2)
    assert.equal(schedule([a,b],[{...link,lag:-2}])[1].start,expected-2)
  })
}
test('cascades across all four links without mutating the input',()=>{
  const moved=initialTasks.map(task=>task.id==='model'?{...task,start:8}:task)
  const before=JSON.stringify(moved)
  const result=schedule(moved,initialLinks)
  for(const link of initialLinks){const a=result.find(task=>task.id===link.from),b=result.find(task=>task.id===link.to);assert.ok(b.start>=minimumStart(a,b,link))}
  assert.equal(JSON.stringify(moved),before)
  assert.equal(result.find(task=>task.id==='api').start,11)
  assert.equal(result.find(task=>task.id==='tests').start,13)
  assert.equal(result.find(task=>task.id==='legacy').start,6)
})
test('keeps slack and handles dependencies regardless of input order',()=>{
  const tasks=[{id:'c',start:0,duration:2},{id:'b',start:10,duration:3},{id:'a',start:0,duration:2}]
  const links=[{id:'bc',from:'b',to:'c',type:'FS',lag:1},{id:'ab',from:'a',to:'b',type:'FS',lag:0}]
  const result=schedule(tasks,links)
  assert.equal(result.find(task=>task.id==='b').start,10)
  assert.equal(result.find(task=>task.id==='c').start,14)
})
test('rejects cycles, unknown tasks, and invalid durations',()=>{
  const tasks=[{id:'a',start:0,duration:1},{id:'b',start:0,duration:1}]
  assert.throws(()=>schedule(tasks,[{id:'ab',from:'a',to:'b',type:'FS',lag:0},{id:'ba',from:'b',to:'a',type:'FS',lag:0}]),/Cyclic/)
  assert.throws(()=>schedule(tasks,[{id:'bad',from:'a',to:'missing',type:'FS',lag:0}]),/Unknown/)
  assert.throws(()=>schedule([{id:'a',start:0,duration:0}],[]),/Invalid/)
})
