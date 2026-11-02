import {useState} from 'react'
import {ArrowDown, Archive, Database, FileStack, CalendarDays} from 'lucide-react'
import type {Lang} from '../content'
import {Button} from './ui/button'

export function ResourcePlanDemo({lang}:{lang:Lang}) {
  const en=lang==='en'
  const [stage,setStage]=useState<'draft'|'publish'>('draft')
  const draft=stage==='draft'
  return <section className="resource-demo" aria-label={en?'Resource-plan storage before and after':'Хранение ресурсных планов до и после'}>
    <div className="demo-window-bar"><span className="window-dots" aria-hidden="true"><i/><i/><i/></span><span>{en?'RESOURCE PLAN / STORAGE':'РЕСУРСНЫЙ ПЛАН / ХРАНЕНИЕ'}</span></div>
    <div className="resource-stage-controls" aria-label={en?'Explore the storage stages':'Этапы хранения'}><Button size="sm" variant={draft?'default':'ghost'} aria-pressed={draft} onClick={()=>setStage('draft')}><Archive size={13}/>{en?'Draft':'Черновик'}</Button><Button size="sm" variant={!draft?'default':'ghost'} aria-pressed={!draft} onClick={()=>setStage('publish')}><CalendarDays size={13}/>{en?'Publish':'Публикация'}</Button></div>
    <div className="resource-comparison">
      <div className="resource-before"><p className="resource-column-label">{en?'BEFORE':'ДО'}</p><h4>{en?'Every entry becomes a row':'Каждая запись — отдельная строка'}</h4><div className="resource-rows" aria-hidden="true">{Array.from({length:24},(_,i)=><span key={i}>RPE</span>)}</div><strong>{en?'Millions of RPEs':'Миллионы RPE'}</strong><p>{en?'Detailed rows accumulate as plans grow. Storage and reads become a bottleneck.':'Детальные записи накапливаются по мере роста планов. Объём хранения и чтение становятся узким местом.'}</p></div>
      <div className="resource-after"><p className="resource-column-label">{en?'AFTER':'ПОСЛЕ'}</p><h4>{draft?(en?'Compressed draft':'Сжатый черновик'):(en?'Monthly published data':'Публикация по месяцам')}</h4>
        {draft?<div className="resource-byte-blob"><Archive size={26}/><code>gzip → byte[]</code><span aria-hidden="true">1F 8B 08 …</span></div>:<div className="resource-months">{(en?['Jan','Feb','Mar']:['Янв','Фев','Мар']).map(month=><div key={month}><CalendarDays size={19}/><strong>{month}</strong><span>Σ RPE</span></div>)}</div>}
        <strong>{draft?(en?'Draft payload stored as bytes':'Данные черновика хранятся в bytes'):(en?'Group by month on publication':'Группировка по месяцам при публикации')}</strong><p>{draft?(en?'gzip compresses the draft payload. Detailed draft entries no longer need individual database rows.':'gzip сжимает данные черновика. Его детальные записи больше не требуют отдельных строк в базе.'):(en?'Publishing persists monthly aggregates. Fewer rows reduce pressure and contain future growth.':'При публикации сохраняются месячные агрегаты. Меньше строк — ниже нагрузка и медленнее рост объёма данных.')}</p>
      </div>
    </div>
    <div className="resource-flow" aria-label={en?'New publication workflow':'Новый процесс публикации'}><span><FileStack size={14}/>{en?'Plan draft':'Черновик плана'}</span><ArrowDown size={13}/><span><Archive size={14}/>gzip / bytes</span><ArrowDown size={13}/><span><CalendarDays size={14}/>{en?'Publish → group by month':'Публикация → по месяцам'}</span><ArrowDown size={13}/><span><Database size={14}/>{en?'Monthly aggregates':'Месячные агрегаты'}</span></div>
    <div className="resource-outcome"><div><strong>~10×</strong><span>{en?'less storage':'меньше объём хранения'}</span></div><div><strong>{en?'Minutes → seconds':'Минуты → секунды'}</strong><span>{en?'resource-plan reads':'чтение ресурсных планов'}</span></div></div>
    <p className="resource-caption">{en?'Combined result of compressed storage and aggregation. The diagram illustrates the structure, not actual row counts or a live benchmark.':'Совместный результат сжатого хранения и агрегаций. Диаграмма показывает структуру, а не фактическое количество строк.'}</p>
  </section>
}
