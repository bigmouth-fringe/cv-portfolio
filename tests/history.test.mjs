import {test} from 'node:test'
import assert from 'node:assert/strict'
import {mkdtempSync,readFileSync,writeFileSync,rmSync,realpathSync} from 'node:fs'
import {tmpdir} from 'node:os'
import {join,sep} from 'node:path'
import {createRequire} from 'node:module'
import ts from 'typescript'

const root=realpathSync(tmpdir()),directory=mkdtempSync(join(root,'history-tests-'))
writeFileSync(join(directory,'package.json'),'{"type":"commonjs"}')
for(const name of ['history','gantt'])writeFileSync(join(directory,`${name}.js`),ts.transpileModule(readFileSync(new URL(`../src/lib/${name}.ts`,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText)
const require=createRequire(import.meta.url)
const {createHistory,commit,undo,redo}=require(join(directory,'history.js'))
const {schedule,initialTasks,initialLinks}=require(join(directory,'gantt.js'))
process.on('exit',()=>{if(realpathSync(directory).startsWith(root+sep))rmSync(directory,{recursive:true,force:true})})
const baseline={tasks:initialTasks,links:initialLinks}
function moved(start){return {tasks:schedule(initialTasks.map(t=>t.id==='model'?{...t,start}:t),initialLinks),links:initialLinks}}
test('undo and redo restore the whole cascade, not just the edited task',()=>{
  const next=moved(4),history=commit(createHistory(baseline),next)
  assert.notDeepEqual(next.tasks,baseline.tasks)
  assert.deepEqual(undo(history).present,baseline)
  assert.deepEqual(redo(undo(history)).present,next)
})
test('a drag with multiple previews commits one operation from its initial snapshot',()=>{
  let history=createHistory(baseline)
  for(const start of [1,2,3,4])history={...history,present:moved(start)}
  history=commit(history,history.present,baseline)
  assert.equal(history.past.length,1)
  assert.deepEqual(undo(history).present,baseline)
})
test('new edits discard the redo branch, and dependency edits restore links and tasks together',()=>{
  const links=initialLinks.map(l=>l.id==='fs'?{...l,lag:3}:l)
  const next={tasks:schedule(initialTasks,links),links}
  let history=commit(createHistory(baseline),next)
  assert.deepEqual(redo(undo(history)).present,next)
  history=commit(undo(history),moved(2))
  assert.equal(history.future.length,0)
  assert.deepEqual(undo(history).present,baseline)
})
test('no-op operations do not create history or erase a redo branch',()=>{
  const history=undo(commit(createHistory(baseline),moved(3)))
  assert.deepEqual(commit(history,baseline),history)
  assert.equal(undo(history),history)
  assert.equal(redo(createHistory(baseline)).present,baseline)
})
