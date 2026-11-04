import { useEffect, useState } from 'react'
import { ArrowRight, Check, RotateCcw, Search, ShieldCheck } from 'lucide-react'
import { Button } from './ui/button'
import type { Lang } from '../content'
import './engineering-demo.css'

const tasks = [
  { id: 1, name: { en: 'Domain model', ru: 'Доменная модель' }, state: 'done', hours: 8 },
  { id: 2, name: { en: 'Planning API', ru: 'API планирования' }, state: 'active', hours: 16 },
  { id: 3, name: { en: 'Calendar UI', ru: 'Интерфейс календаря' }, state: 'active', hours: 12 },
  { id: 4, name: { en: 'Regression tests', ru: 'Регрессионные тесты' }, state: 'ready', hours: 6 },
]

export function EngineeringDemo({ kind, lang }: { kind: string; lang: Lang }) {
  const en = lang === 'en'
  const [fail, setFail] = useState(false)
  const [result, setResult] = useState<'idle' | 'commit' | 'rollback'>('idle')
  const [board, setBoard] = useState(false)
  const [onlyActive, setOnlyActive] = useState(false)
  const [sort, setSort] = useState(false)
  const [term, setTerm] = useState(en ? 'plan' : 'план')
  const [finance, setFinance] = useState(false)
  const [parallel, setParallel] = useState(true)
  useEffect(() => setTerm(lang === 'en' ? 'plan' : 'план'), [lang])
  const title = kind === 'operation' ? 'OperationContext' : kind === 'views' ? 'ViewQueryBuilder' : kind === 'search' ? 'GlobalSearch' : 'Test infrastructure'
  const labels = { done: en ? 'Done' : 'Готово', active: en ? 'In progress' : 'В работе', ready: en ? 'Ready' : 'В очереди' }
  const rows = tasks.filter(t => !onlyActive || t.state === 'active').sort((a, b) => sort ? b.hours - a.hours : a.id - b.id)
  const documents = [
    { title: en ? 'Project planning' : 'Планирование проекта', type: 'Project', restricted: false },
    { title: en ? 'Planning API guide' : 'Руководство API планирования', type: 'WikiPage', restricted: false },
    { title: en ? 'Financial plan' : 'Финансовый план', type: 'Report', restricted: true },
  ]
  const hits = documents.filter(d => (!d.restricted || finance) && d.title.toLocaleLowerCase().includes(term.toLocaleLowerCase()))
  return <section className="engineering-demo" aria-label={title}>
    <div className="demo-window-bar"><span className="window-dots" aria-hidden="true"><i/><i/><i/></span><span>{title}</span><span className="demo-live">{en ? 'INTERACTIVE MODEL' : 'ИНТЕРАКТИВНАЯ МОДЕЛЬ'}</span></div>
    {kind === 'operation' && <>
      <div className="engineering-controls"><label><input type="checkbox" checked={fail} onChange={e => { setFail(e.target.checked); setResult('idle') }}/>{en ? 'Fail on the last step' : 'Ошибка на последнем шаге'}</label><Button size="sm" onClick={() => setResult(fail ? 'rollback' : 'commit')}>{en ? 'Run operation' : 'Выполнить'}</Button><Button variant="ghost" size="icon" aria-label={en ? 'Reset operation' : 'Сбросить операцию'} onClick={() => setResult('idle')}><RotateCcw size={14}/></Button></div>
      <div className="operation-boundary"><p>BEGIN TRANSACTION</p>{['ProjectTask', 'Assignment', 'Custom hook'].map((step, i) => <div className={`operation-step ${result === 'rollback' ? 'rolled-back' : result === 'commit' ? 'committed' : ''}`} key={step}><span>0{i + 1}</span><strong>{step}</strong><small>{result === 'idle' ? (en ? 'Pending' : 'Ожидание') : result === 'rollback' ? (en ? 'Rolled back' : 'Отменено') : (en ? 'Committed' : 'Сохранено')}</small></div>)}<div className="operation-result" aria-live="polite">{result === 'idle' ? 'COMMIT / ROLLBACK' : result === 'commit' ? 'COMMIT ✓' : 'ROLLBACK ↶'}</div></div>
      <div className={`operation-after ${result === 'commit' ? 'committed' : ''}`}><ShieldCheck size={17}/><span>AfterCommit → {en ? 'notification' : 'уведомление'}</span><b>{result === 'commit' ? (en ? 'Sent' : 'Отправлено') : (en ? 'Not sent' : 'Не отправлено')}</b></div>
      <p className="engineering-caption">{en ? 'One operation owns the commit boundary. A failed step restores all changes; notification follows a successful commit.' : 'Одна операция управляет фиксацией. Ошибка откатывает все изменения; уведомление отправляется после успешного commit.'}</p>
    </>}
    {kind === 'views' && <>
      <div className="engineering-controls"><Button size="sm" variant={!board ? 'default' : 'ghost'} onClick={() => setBoard(false)}>{en ? 'List' : 'Список'}</Button><Button size="sm" variant={board ? 'default' : 'ghost'} onClick={() => setBoard(true)}>{en ? 'Board' : 'Доска'}</Button><label><input type="checkbox" checked={onlyActive} onChange={e => setOnlyActive(e.target.checked)}/>{en ? 'In progress only' : 'Только в работе'}</label><label><input type="checkbox" checked={sort} onChange={e => setSort(e.target.checked)}/>{en ? 'Hours ↓' : 'Часы ↓'}</label></div>
      {board ? <div className="query-board">{(['ready', 'active', 'done'] as const).map(state => <div key={state}><h4>{labels[state]}</h4>{rows.filter(t => t.state === state).map(t => <div className="query-card" key={t.id}>{t.name[lang]}<span>{t.hours} h</span></div>)}</div>)}</div> : <div className="query-list">{rows.map(t => <div key={t.id}><strong>{t.name[lang]}</strong><span>{labels[t.state as keyof typeof labels]}</span><b>{t.hours} h</b></div>)}</div>}
      <pre className="engineering-query"><code>{`query${onlyActive ? '\n    .Where(task => task.State == TaskState.InProgress)' : ''}${sort ? '\n    .OrderByDescending(task => task.Hours)' : ''}\n    .Select(configuredProjection)${board ? '\n    // Group into board columns' : '\n    .Take(pageSize)'}`}</code></pre><p className="engineering-caption">{en ? 'A small browser model of shared data, filters, ordering, and projection. The production implementation builds EF queries from metadata.' : 'Браузерная модель общих данных, фильтров, сортировки и проекции. Production-реализация строит EF-запросы по метамодели.'}</p>
    </>}
    {kind === 'search' && <>
      <div className="search-demo-input"><Search size={16}/><input aria-label={en ? 'Search sample documents' : 'Поиск по демонстрационным документам'} value={term} onChange={e => setTerm(e.target.value)}/></div>
      <div className="engineering-controls"><label><input type="checkbox" checked={finance} onChange={e => setFinance(e.target.checked)}/>{en ? 'Financial report access' : 'Доступ к финансовым отчётам'}</label></div>
      <div className="search-demo-results" aria-live="polite">{hits.map(d => <div key={d.type}><span>{d.type}</span><strong>{d.title}</strong><Check size={14}/></div>)}{!hits.length && <p>{en ? 'No accessible matches' : 'Доступных результатов нет'}</p>}</div>
      <div className="search-demo-pipeline"><span>Full-text</span><ArrowRight size={12}/><span>Trigram</span><ArrowRight size={12}/><span>{en ? 'Permissions' : 'Права'}</span></div><p className="engineering-caption">{en ? 'Sample interface illustrating permission-filtered results. PostgreSQL full-text/trigram ranking runs on the server in production; this browser model uses text matching.' : 'Пример выдачи с учётом доступа. В production ранжирование full-text/trigram выполняет PostgreSQL; браузерная модель использует поиск по тексту.'}</p>
    </>}
    {kind === 'tests' && <>
      <div className="engineering-controls"><Button size="sm" variant={!parallel ? 'default' : 'ghost'} onClick={() => setParallel(false)}>{en ? 'Before' : 'До'}</Button><Button size="sm" variant={parallel ? 'default' : 'ghost'} onClick={() => setParallel(true)}>{en ? 'After' : 'После'}</Button></div>
      <div className="test-flow"><p>{en ? 'SHARED DATA PREPARATION' : 'ПОДГОТОВКА ОБЩИХ ДАННЫХ'}</p>{parallel ? <><div className="test-setup">AssemblyInitialize → Default deployment</div><div className="test-parallel">{['Planning', 'Finance', 'Entity services'].map(name => <div key={name}><Check size={14}/><strong>{name}</strong><span>{en ? 'Own fixture' : 'Своя фикстура'}</span></div>)}</div></> : <div className="test-sequential">{['Planning', 'Finance', 'Entity services'].map(name => <div key={name}><span>Reset DB → Deploy</span><ArrowRight size={12}/><strong>{name}</strong></div>)}</div>}</div>
      <div className="test-scale"><span>{en ? 'Planning regression scenarios' : 'Регрессионные сценарии планирования'}</span><strong>100 / 1000 {en ? 'tasks' : 'задач'}</strong></div><p className="engineering-caption">{en ? 'Shared deployment moves to assembly initialization; test classes can run in parallel. Shared fixtures are initialized once; each test class owns its data.' : 'Общий deployment перенесён в инициализацию сборки; тестовые классы могут запускаться параллельно. Общие данные готовятся один раз; каждый тестовый класс работает со своей фикстурой.'}</p>
    </>}
  </section>
}

