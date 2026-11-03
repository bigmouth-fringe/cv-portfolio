import { useState } from 'react'
import { ArrowLeftRight, Check, Code2 } from 'lucide-react'
import type { Lang } from '../content'
import { Button } from './ui/button'

function snippets() {
  const before = `var tasks = await context
    .Set<ProjectTask>()
    .FromSqlRaw(
        """
        SELECT *
        FROM project_task
        WHERE project_id = {0}
        FOR UPDATE
        """,
        projectId
    )
    .ToListAsync();

await context
    .Set<Project>()
    .FromSqlRaw(
        """
        SELECT *
        FROM project
        WHERE id = {0}
        FOR UPDATE
        """,
        projectId
    )
    .ToListAsync();`
  const after = `var tasks = await context
    .Set<ProjectTask>()
    .Where(task => task.ProjectId == projectId)
    .WithLock()
    .ToListAsync();

await context
    .Set<Project>()
    .Where(project => project.Id == projectId)
    .LockAsync();`
  return { before, after }
}

function Code({ text, before = false }: { text: string; before?: boolean }) {
  let sql = false
  return <pre><code>{text.split('\n').map((line, i) => {
    if (line.includes('"""')) sql = !sql
    const isSql = sql || line.includes('"""')
    return <span className={`lock-code-line ${isSql ? 'lock-sql-line' : ''} ${!before && /WithLock|LockAsync/.test(line) ? 'lock-extension-line' : ''}`} key={i}>
      <span className="lock-line-number" aria-hidden="true">{i + 1}</span>
      <span>{isSql ? line : line.split(/(\b(?:var|await)\b|\b(?:ProjectTask|Project)\b|\b(?:WithLock|LockAsync)\b)/g).map((part, j) => <span key={j} className={/^(var|await)$/.test(part) ? 'code-keyword' : /^(ProjectTask|Project)$/.test(part) ? 'code-type' : /^(WithLock|LockAsync)$/.test(part) ? 'lock-method' : undefined}>{part}</span>)}</span>
    </span>
  })}</code></pre>
}

export function LockDemo({ lang = 'ru' }: { lang?: Lang }) {
  const en = lang === 'en'
  const [split, setSplit] = useState(51)
  const { before, after } = snippets()
  const lines = (text: string) => text.split('\n').filter(line => line.trim()).length
  const removed = lines(before) - lines(after)
  return <section className="lock-demo" aria-label={en ? "Raw SQL and locking extensions comparison" : "Сравнение Raw SQL и расширений для блокировок"}>
    <div className="demo-window-bar"><span className="window-dots" aria-hidden="true"><i/><i/><i/></span><span>RowLocking.cs</span><span className="demo-live">C# / EF CORE / POSTGRESQL</span></div>
    <div className="lock-toolbar"><div><Code2 size={16}/><span>{en ? 'One scenario. Two approaches.' : 'Один сценарий. Два способа.'}</span></div><div className="lock-view-controls"><Button size="sm" variant="ghost" onClick={() => setSplit(100)}>{en ? 'Before' : 'До'}</Button><Button size="sm" variant="ghost" onClick={() => setSplit(51)}>{en ? 'Compare' : 'Сравнить'}</Button><Button size="sm" variant="ghost" onClick={() => setSplit(0)}>{en ? 'After' : 'После'}</Button></div></div>
    <div className="lock-comparison" style={{ '--lock-split': `${split}%` } as React.CSSProperties}>
      <div className="lock-pane lock-before" aria-hidden={split === 0}><div className="lock-pane-label"><span>{en ? 'BEFORE · RAW SQL' : 'ДО · RAW SQL'}</span><b>{lines(before)} {en ? 'lines' : 'строк'}</b></div><Code text={before} before/></div>
      <div className="lock-pane lock-after" aria-hidden={split === 100}><div className="lock-pane-label"><span>{en ? 'AFTER · LINQ + EXTENSIONS' : 'ПОСЛЕ · LINQ + EXTENSIONS'}</span><b>{lines(after)} {en ? 'lines' : 'строк'}</b></div><Code text={after}/><div className="lock-after-note"><Check size={15}/><span>{en ? 'SQL and locking rules live in one place.' : 'SQL и правила блокировок — в одном месте.'}<br/>{en ? 'Application code expresses intent.' : 'В прикладном коде остаётся намерение.'}</span></div></div>
      <div className="lock-divider" style={{ left: `${split}%` }} aria-hidden="true"><span><ArrowLeftRight size={15}/></span></div>
      <input className="lock-curtain" type="range" min="0" max="100" value={split} onChange={event => setSplit(Number(event.target.value))} aria-label={en ? 'Before and after comparison divider' : 'Шторка сравнения до и после'}/>
    </div>
    <div className="lock-outcome"><div><strong>−{removed}</strong><span>{en ? 'lines in this example' : 'строк в этом примере'}</span></div><div><strong>2</strong><span>{en ? 'reusable extensions' : 'переиспользуемых расширения'}</span></div></div>
    <p className="lock-caption">{en ? 'Drag the divider or use the arrow keys. Nonblank lines are counted. Both examples run inside an existing transaction.' : 'Потяните шторку или используйте стрелки на клавиатуре. Строки считаются без пустых строк. Оба варианта выполняются внутри уже открытой транзакции.'}</p>
  </section>
}
