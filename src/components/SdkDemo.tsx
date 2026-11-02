import {useEffect, useRef, useState} from 'react'
import {ChevronLeft, ChevronRight, Pause, Play} from 'lucide-react'
import {Button} from './ui/button'
import type {Lang} from '../content'
import {hookExamples, hookHeader} from '../lib/sdkExamples'

function Highlight({text}:{text:string}) {
  return <>{text.split(/("[^"\n]*"|\b(?:public|async|await|if|return|is|not|null|true|new|var|int)\b|\b(?:Task|ProjectTask)\b|\b(?:current|previous|automation)\b)/g).map((part,i)=>
    <span key={i} className={part.startsWith('"')?'code-string':/^(public|async|await|if|return|is|not|null|true|new|var|int)$/.test(part)?'code-keyword':/^(Task|ProjectTask)$/.test(part)?'code-type':/^(current|previous|automation)$/.test(part)?'code-variable':undefined}>{part}</span>)}</>
}

export function SdkDemo({lang}:{lang:Lang}) {
  const en=lang==='en'
  const [index,setIndex]=useState(0)
  const [characters,setCharacters]=useState(hookExamples[0].body.length)
  const [phase,setPhase]=useState<'typing'|'holding'|'erasing'>('holding')
  const [playing,setPlaying]=useState(true)
  const [reduced,setReduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [visible,setVisible]=useState(false)
  const root=useRef<HTMLElement>(null)
  const example=hookExamples[index]

  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)')
    const change=()=>setReduced(media.matches)
    media.addEventListener('change',change)
    const observer=new IntersectionObserver(entries=>setVisible(entries[0].isIntersecting))
    if(root.current)observer.observe(root.current)
    return()=>{media.removeEventListener('change',change);observer.disconnect()}
  },[])
  useEffect(()=>{
    if(!playing||reduced||!visible)return
    const timer=setTimeout(()=>{
      if(phase==='holding')setPhase('erasing')
      else if(phase==='erasing'){
        if(characters>0)setCharacters(n=>Math.max(0,n-8))
        else {setIndex(n=>(n+1)%hookExamples.length);setPhase('typing')}
      } else if(characters<example.body.length)setCharacters(n=>Math.min(example.body.length,n+3))
      else setPhase('holding')
    },phase==='holding'?4500:phase==='erasing'?18:24)
    return()=>clearTimeout(timer)
  },[playing,reduced,visible,phase,characters,example.body.length])
  function select(delta:number){const next=(index+delta+hookExamples.length)%hookExamples.length;setIndex(next);setCharacters(hookExamples[next].body.length);setPhase('holding');setPlaying(false)}
  const code=`${hookHeader}\n${reduced?example.body:example.body.slice(0,characters)}`
  return <section ref={root} className="sdk-demo" aria-label={en?'C# AfterUpsert hook examples':'Примеры C#-хука AfterUpsert'}>
    <div className="demo-window-bar"><span className="window-dots" aria-hidden="true"><i/><i/><i/></span><span>ProjectTaskHooks.cs</span><span className="demo-live">C# / SDK</span></div>
    <div className="sdk-example-heading"><span>{String(index+1).padStart(2,'0')} / {hookExamples.length}</span><h4>{example.title[lang]}</h4></div>
    <pre className="sdk-code" aria-label={en?'C# example code':'Пример кода C#'}><code><Highlight text={code}/><span className={playing&&!reduced&&visible?'code-caret':'code-caret paused'} aria-hidden="true"/>{'\n}'}</code></pre>
    <div className="sdk-controls"><span>AfterUpsert <b>·</b> ProjectTask</span><div><Button size="icon" variant="ghost" aria-label={en?'Previous hook example':'Предыдущий пример хука'} onClick={()=>select(-1)}><ChevronLeft size={15}/></Button><Button size="icon" variant="ghost" disabled={reduced} aria-label={playing&&!reduced?(en?'Pause code animation':'Приостановить анимацию кода'):(en?'Play code animation':'Включить анимацию кода')} onClick={()=>setPlaying(!playing)}>{playing&&!reduced?<Pause size={14}/>:<Play size={14}/>}</Button><Button size="icon" variant="ghost" aria-label={en?'Next hook example':'Следующий пример хука'} onClick={()=>select(1)}><ChevronRight size={15}/></Button></div></div>
    <p className="sdk-caption">{en?'Illustrative hook API. Compare current and previous state to customize what happens after a task is saved.':'Пример API хука. Сравните текущее и предыдущее состояние, чтобы настроить действия после сохранения задачи.'}</p>
  </section>
}
