import { useState } from 'react'
import { ArrowRight, Search } from 'lucide-react'
import { Button } from './ui/button'
import type { Lang } from '../content'
import { trigrams, wordSimilarity } from '../lib/searchDemo'
import './engineering-demo.css'
import './query-demo.css'

const records = [
  { id: 1, title: 'Product launch', status: 'active', amount: 120 },
  { id: 2, title: 'Website refresh', status: 'ready', amount: 80 },
  { id: 3, title: 'Customer portal', status: 'active', amount: 240 },
  { id: 4, title: 'API migration', status: 'done', amount: 160 },
  { id: 5, title: 'Design system', status: 'active', amount: 100 },
  { id: 6, title: 'Mobile application', status: 'ready', amount: 320 },
]
const documents = [
  { id: 1, title: 'Application architecture', language: 'EN', restricted: false },
  { id: 2, title: 'Архитектура приложения', language: 'RU', restricted: false },
  { id: 3, title: 'Database optimization', language: 'EN', restricted: false },
  { id: 4, title: 'Оптимизация базы данных', language: 'RU', restricted: false },
  { id: 5, title: 'Application security audit', language: 'EN', restricted: true },
  { id: 6, title: 'Аудит безопасности приложения', language: 'RU', restricted: true },
]
export function EngineeringDemo({ kind, lang }: { kind: string; lang: Lang }) {
  const en = lang === 'en'
  const l = (a: string, b: string) => en ? a : b
  const [status, setStatus] = useState('any')
  const [minimum, setMinimum] = useState(0)
  const [cursor, setCursor] = useState(0)
  const [term, setTerm] = useState('aplication')
  const [fuzzy, setFuzzy] = useState(true)
  const [access, setAccess] = useState(false)
  const title = kind === 'views' ? 'UI → Universal query' : 'EN + RU / Trigram search'
  const filtered = records.filter(r => (status === 'any' || r.status === status) && r.amount >= minimum)
  const page = filtered.filter(r => r.id > cursor).slice(0, 2)
  const last = page.at(-1)?.id ?? cursor
  const next = filtered.some(r => r.id > last)
  const token = cursor ? btoa(`id:${cursor}`) : null
  const request = { entity: 'WorkItem', filters: [...(status !== 'any' ? [{ field: 'Status', op: 'eq', value: status }] : []), ...(minimum ? [{ field: 'Amount', op: 'gte', value: minimum }] : [])], orderBy: ['Id ASC'], cursor: token, take: 2 }
  const query = `db.Set<WorkItem>()${status !== 'any' ? `\n  .Where(x => x.Status == "${status}")` : ''}${minimum ? `\n  .Where(x => x.Amount >= ${minimum})` : ''}${cursor ? `\n  .Where(x => x.Id > ${cursor})` : ''}\n  .OrderBy(x => x.Id)\n  .Select(configuredProjection)\n  .Take(2)`
  const search = term.trim().toLowerCase()
  const hits = documents.filter(d => !d.restricted || access).map(d => ({ ...d, exact: !!search && d.title.toLowerCase().includes(search), score: wordSimilarity(search, d.title) })).filter(d => !search || d.exact || (fuzzy && d.score >= .3)).sort((a, b) => Number(b.exact) - Number(a.exact) || b.score - a.score)
  return <section className="engineering-demo query-demo" aria-label={kind === 'views' ? 'ViewQueryBuilder' : 'GlobalSearch'}>
    <div className="demo-window-bar"><span className="window-dots" aria-hidden="true"><i/><i/><i/></span><span>{title}</span></div>
    {kind === 'views' ? <>
      <div className="query-inputs"><label>{l('Status', 'Статус')}<select aria-label={l('Status', 'Статус')} value={status} onChange={e => { setStatus(e.target.value); setCursor(0) }}><option value="any">{l('Any', 'Любой')}</option><option value="active">{l('Active', 'В работе')}</option><option value="ready">{l('Ready', 'В очереди')}</option><option value="done">{l('Done', 'Готово')}</option></select></label><label>{l('Minimum amount', 'Минимальная сумма')}<select aria-label={l('Minimum amount', 'Минимальная сумма')} value={minimum} onChange={e => { setMinimum(Number(e.target.value)); setCursor(0) }}>{[0,100,200].map(n => <option key={n} value={n}>{n}</option>)}</select></label></div>
      <div className="query-stage-label">01 / UI REQUEST <ArrowRight size={13}/> METADATA</div><pre className="engineering-query">{JSON.stringify(request, null, 2)}</pre>
      <div className="query-stage-label">02 / BACKEND <ArrowRight size={13}/> LINQ / EF CORE</div><pre className="engineering-query">{query}</pre>
      <div className="query-output" aria-live="polite">{page.map(r => <div key={r.id}><code>#{r.id}</code><span>{r.title}</span><b>{r.amount}</b></div>)}{!page.length && <p>{l('No matching records', 'Нет подходящих записей')}</p>}</div>
      <div className="engineering-controls"><Button size="sm" variant="outline" disabled={!cursor} onClick={() => setCursor(0)}>{l('First page', 'В начало')}</Button><Button size="sm" disabled={!next} onClick={() => setCursor(last)}>{l('Next cursor', 'Следующий курсор')}<ArrowRight size={12}/></Button><code>{token ?? 'cursor: null'}</code></div>
      <p className="engineering-caption">{l('UI sends data, not executable code. The backend resolves allowed metadata fields, builds filters and projections, then applies stable ordering and cursor paging. Browser simulation with sample records.', 'UI передаёт данные, а не исполняемый код. Backend сопоставляет поля с разрешёнными метаданными, строит фильтры и проекции, добавляет стабильную сортировку и курсорную пагинацию. Браузерная модель на примере условных записей.')}</p>
    </> : <>
      <div className="search-demo-input"><Search size={15}/><input aria-label={l('Search sample documents', 'Поиск по демонстрационным документам')} value={term} onChange={e => setTerm(e.target.value)} placeholder="application / приложение"/></div>
      <div className="search-presets">{['aplication','архитектра','databse','оптимизаця'].map(q => <Button size="sm" variant="ghost" key={q} onClick={() => setTerm(q)}>{q}</Button>)}</div>
      <div className="engineering-controls"><label><input type="checkbox" checked={fuzzy} onChange={e => setFuzzy(e.target.checked)}/>{l('Trigram matching', 'Триграммный поиск')}</label><label><input type="checkbox" checked={access} onChange={e => setAccess(e.target.checked)}/>{l('Restricted documents', 'Закрытые документы')}</label></div>
      <div className="trigram-tokens" aria-label={l('Query trigrams', 'Триграммы запроса')}>{[...trigrams(search)].slice(0,24).map(t => <code key={t}>{t.replaceAll(' ', '·')}</code>)}</div>
      <div className="search-demo-results" aria-live="polite">{hits.map(d => <div key={d.id}><span>{d.language} · {d.restricted ? l('Restricted', 'Закрытый') : l('Public', 'Открытый')}</span><strong>{d.title}</strong><small>{!search ? '—' : d.exact ? l('Exact', 'Точное') : `${Math.round(d.score * 100)}%`}</small></div>)}{!hits.length && <p>{l('No accessible matches', 'Доступных результатов нет')}</p>}</div>
      <p className="engineering-caption">{l('Try a typo, then switch trigrams off. English and Russian documents share one index; changing the interface language does not change the corpus. This model compares word trigrams (intersection / union, threshold 0.30); production uses PostgreSQL full-text and pg_trgm ranking.', 'Попробуйте опечатку и отключите триграммы. Английские и русские документы ищутся вместе; язык интерфейса не меняет набор документов. Модель сравнивает триграммы слов (пересечение / объединение, порог 0,30); в production используются PostgreSQL full-text и ранжирование pg_trgm.')}</p>
    </>}
  </section>
}
