import {useState} from 'react'
import type {Lang} from '../content'
import type {CVProfile} from '../profiles'

const featured=new Set(['C#','.NET','ASP.NET Core','EF Core','PostgreSQL'])

export function ToolkitCloud({groups,lang,title}:{groups:CVProfile['toolkit'];lang:Lang;title:string}) {
  const [selected,setSelected]=useState<string | null>(null)
  const entries=groups.flatMap((group,tone)=>group.skills.map(skill=>({skill,group:group.label.en,tone})))
  const visible=selected?entries.filter(entry=>entry.group===selected):entries
  return <aside className="toolkit toolkit-cloud" aria-label={title}>
    <div className="toolkit-cloud-heading"><span className="eyebrow">{title}</span><span className="toolkit-tag-count" aria-live="polite">{selected?`${visible.length} / ${entries.length}`:entries.length}</span></div>
    <div className="toolkit-filters" role="group" aria-label={lang==='en'?'Filter the toolkit by area':'Фильтр технологий по области'}>
      <button type="button" aria-pressed={selected===null} onClick={()=>setSelected(null)}>{lang==='en'?'All':'Все'}</button>
      {groups.map((group,tone)=><button type="button" key={group.label.en} data-tone={tone} aria-pressed={selected===group.label.en} onClick={()=>setSelected(selected===group.label.en?null:group.label.en)}><i aria-hidden="true"/>{group.label[lang]}</button>)}
    </div>
    <ul className="toolkit-tags" aria-label={lang==='en'?'Technologies and engineering practices':'Технологии и инженерные практики'}>
      {visible.map(entry=><li key={entry.skill} data-tone={entry.tone} className={featured.has(entry.skill)?'featured':''}>{entry.skill}</li>)}
    </ul>
  </aside>
}
