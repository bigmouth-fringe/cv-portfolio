import { useState } from 'react'
import type { Lang } from '../content'
import type { ArchitectureModel } from '../architecture'
import { cn } from '../lib/utils'

export function Architecture({ model, lang }: { model: ArchitectureModel; lang: Lang }) {
  const [selected, setSelected] = useState('data')
  const active = model.groups.find(group => group.id === selected) ?? model.groups[0]
  const en = lang === 'en'
  return <figure className="architecture" aria-labelledby="architecture-title">
    <figcaption id="architecture-title"><span>{en ? 'TECHNOLOGY MAP' : 'КАРТА ТЕХНОЛОГИЙ'}</span><span>PORTS & ADAPTERS</span></figcaption>
    <div className="hex-map" role="group" aria-label={en ? 'Explore the architecture layers' : 'Выберите слой архитектуры'}>
      <svg className="hex-lines" viewBox="0 0 600 440" aria-hidden="true">
        <defs><marker id="dependency-arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 6 3 0 6" fill="none" stroke="currentColor"/></marker></defs>
        <polygon className="hex-outer" points="300,65 445,145 445,295 300,375 155,295 155,145"/>
        <polygon className="hex-inner" points="300,145 366,183 366,257 300,295 234,257 234,183"/>
        <g className="hex-dependencies" markerEnd="url(#dependency-arrow)"><path d="M110 85 173 148"/><path d="M490 85 427 148"/><path d="M506 219 452 219"/><path d="M490 355 427 292"/><path d="M110 355 173 292"/><path d="M94 219 148 219"/></g>
        <g className="hex-ports">{[[184,129],[416,129],[445,219],[416,311],[184,311],[155,219]].map(([x,y])=><circle key={`${x}-${y}`} cx={x} cy={y} r="4"/>)}</g>
      </svg>
      {model.groups.map(group=><button key={group.id} type="button" aria-pressed={active.id===group.id} aria-controls="architecture-detail" onClick={()=>setSelected(group.id)} className={cn('hex-zone',`hex-${group.id}`,active.id===group.id && 'is-selected')}><strong>{group.label[lang]}</strong><span>{group.id==='domain'?'C# · .NET · DDD':group.id==='application'?'CQRS · async / await':group.technologies.slice(0,2).join(' · ')}</span></button>)}
    </div>
    <div className="architecture-detail" id="architecture-detail" aria-live="polite"><div className="architecture-detail-heading"><h3>{active.label[lang]}</h3><span>{active.kind[lang]}</span></div><div className="tags">{active.technologies.map(technology=><span key={technology}>{technology}</span>)}</div><p>{active.description[lang]}</p></div>
    <div className="architecture-engineering"><span>{en ? 'DELIVERY & OBSERVABILITY' : 'ДОСТАВКА И НАБЛЮДАЕМОСТЬ'}</span><p>{model.engineering.join(' · ')}</p></div>
    <div className="architecture-inventory">{model.groups.map(group=><button type="button" key={group.id} onClick={()=>setSelected(group.id)} aria-pressed={active.id===group.id}><strong>{group.label[lang]}</strong><span>{group.technologies.join(' · ')}</span></button>)}</div><p className="architecture-note">{en ? 'Dependencies point inward. The domain owns the rules.' : 'Зависимости направлены внутрь. Правила принадлежат домену.'}</p>
  </figure>
}
