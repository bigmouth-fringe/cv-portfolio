import { useEffect, useId, useRef, useState, type PointerEvent } from 'react'
import { ArrowLeft, ArrowRight, RotateCcw, Minus, Plus, Maximize2, Undo2, Redo2 } from 'lucide-react'
import { Button } from './ui/button'
import { NativeSelect, NativeSelectOption } from './ui/native-select'
import type { Lang } from '../content'
import { dependencyTypes, initialLinks, initialTasks, schedule, type DependencyType, type GanttLink, type GanttTask } from '../lib/gantt'

import { createHistory, commit, undo, redo, type Snapshot } from '../lib/history'

const rowHeight = 43
const headerHeight = 32
const colors: Record<DependencyType, string> = { FS: 'var(--dep-fs)', SS: 'var(--dep-ss)', FF: 'var(--dep-ff)', SF: 'var(--dep-sf)' }
type Drag = { mode: 'move' | 'start' | 'finish' | 'pan'; id?: string; x: number; tasks: GanttTask[]; origin: number }

export function GanttDemo({ lang, historyEnabled=false }: { lang: Lang; historyEnabled?: boolean }) {
  const en = lang === 'en'
  const names: Record<string, string> = en ? {model:'Domain model',api:'Backend API',ui:'New UI',tests:'Regression tests',legacy:'Legacy UI'} : {model:'Доменная модель',api:'Backend API',ui:'Новый UI',tests:'Регресс-тесты',legacy:'Старый UI'}
  const explanations: Record<DependencyType,string> = en ? {FS:'Finish → Start: the successor starts after the predecessor finishes.',SS:'Start → Start: the successor cannot start before the predecessor starts.',FF:'Finish → Finish: the successor cannot finish before the predecessor finishes.',SF:'Start → Finish: the successor cannot finish before the predecessor starts.'} : {FS:'Финиш → Старт: следующая задача начинается после завершения предыдущей.',SS:'Старт → Старт: следующая задача не начинается раньше старта предыдущей.',FF:'Финиш → Финиш: следующая задача не заканчивается раньше завершения предыдущей.',SF:'Старт → Финиш: следующая задача не заканчивается раньше старта предыдущей.'}
  const [history,setHistory] = useState(()=>createHistory({tasks:initialTasks.map(task=>({...task})),links:initialLinks.map(link=>({...link}))}))
  const {tasks,links}=history.present
  const dragBaseline=useRef<Snapshot | null>(null)
  const [origin,setOrigin] = useState(-3)
  const [scale,setScale] = useState(28)
  const [width,setWidth] = useState(360)
  const [taskId,setTaskId] = useState('api')
  const [linkId,setLinkId] = useState('fs')
  const [message,setMessage] = useState('')
  const timeline = useRef<HTMLDivElement>(null)
  const svg = useRef<SVGSVGElement>(null)
  const drag = useRef<Drag | null>(null)
  const measured = useRef(false)
  const uid = useId().replace(/:/g,'')
  const activeTask = tasks.find(task=>task.id===taskId)!
  const activeLink = links.find(link=>link.id===linkId)!

  useEffect(()=>{
    const element=timeline.current
    if(!element)return
    const observer=new ResizeObserver(entries=>{
      const next=entries[0].contentRect.width
      setWidth(next)
      if(!measured.current && next>0){setScale(Math.max(12,Math.min(34,next/13)));measured.current=true}
    })
    observer.observe(element)
    function wheel(event:WheelEvent){
      if(event.ctrlKey || (!event.shiftKey && Math.abs(event.deltaX)<=Math.abs(event.deltaY)))return
      event.preventDefault()
      const delta=event.shiftKey?event.deltaY:event.deltaX
      setOrigin(value=>value+delta/scale)
    }
    element.addEventListener('wheel',wheel,{passive:false})
    return()=>{observer.disconnect();element.removeEventListener('wheel',wheel)}
  },[scale])

  function apply(nextTasks:GanttTask[],nextLinks=links){
    try{const next={tasks:schedule(nextTasks,nextLinks),links:nextLinks};setHistory(value=>drag.current?{...value,present:next}:commit(value,next));setMessage('')}
    catch{setMessage(en?'That change would create an invalid schedule.':'Изменение создаёт некорректный план.')}
  }
  function updateTask(id:string,patch:Partial<GanttTask>){apply(tasks.map(task=>task.id===id?{...task,...patch}:task))}
  function updateLink(patch:Partial<GanttLink>){apply(tasks,links.map(link=>link.id===linkId?{...link,...patch}:link))}
  function startDrag(event:PointerEvent<SVGElement>,mode:Drag['mode'],id?:string){
    if(event.button!==0)return
    if(historyEnabled)(event.currentTarget.closest('section') as HTMLElement | null)?.focus({preventScroll:true})
    event.preventDefault();event.stopPropagation()
    if(id)setTaskId(id)
    dragBaseline.current={tasks,links}
    drag.current={mode,id,x:event.clientX,tasks:tasks.map(task=>({...task})),origin}
    svg.current?.setPointerCapture(event.pointerId)
  }
  function moveDrag(event:PointerEvent<SVGSVGElement>){
    const current=drag.current
    if(!current)return
    const delta=(event.clientX-current.x)/scale
    if(current.mode==='pan'){setOrigin(current.origin-delta);return}
    const task=current.tasks.find(item=>item.id===current.id)!
    const days=Math.round(delta)
    let patch:Partial<GanttTask>
    if(current.mode==='move')patch={start:task.start+days}
    else if(current.mode==='finish')patch={duration:Math.max(1,task.duration+days)}
    else {const shift=Math.min(days,task.duration-1);patch={start:task.start+shift,duration:task.duration-shift}}
    apply(current.tasks.map(item=>item.id===task.id?{...item,...patch}:item))
  }
  function endDrag(event:PointerEvent<SVGSVGElement>){const baseline=dragBaseline.current;if(baseline && drag.current?.mode!=='pan')setHistory(value=>commit(value,value.present,baseline));dragBaseline.current=null;drag.current=null;if(svg.current?.hasPointerCapture(event.pointerId))svg.current.releasePointerCapture(event.pointerId)}
  function fit(){const first=Math.min(...tasks.map(task=>task.start));const last=Math.max(...tasks.map(task=>task.start+task.duration));setOrigin(first-2);setScale(Math.max(12,Math.min(56,width/(last-first+4))))}
  function zoom(factor:number){const next=Math.max(12,Math.min(64,scale*factor));setOrigin(origin+width/(2*scale)-width/(2*next));setScale(next)}
  function reset(){setHistory(createHistory({tasks:initialTasks.map(task=>({...task})),links:initialLinks.map(link=>({...link}))}));setOrigin(-3);setScale(Math.max(12,Math.min(34,width/13)));setTaskId('api');setLinkId('fs');setMessage('')}
  const dayStep=scale<18?2:1
  const firstDay=Math.floor(origin/dayStep)*dayStep
  const ticks=Array.from({length:Math.ceil(width/(scale*dayStep))+2},(_,index)=>firstDay+index*dayStep)
  const x=(day:number)=>(day-origin)*scale
  const height=headerHeight+tasks.length*rowHeight

  return <section className="gantt-demo" tabIndex={historyEnabled?0:undefined} onKeyDown={event=>{
    if(!historyEnabled || !(event.ctrlKey||event.metaKey) || (event.target as HTMLElement).closest('input,textarea,select,[contenteditable="true"]'))return
    const key=event.key.toLowerCase()
    if(key==='z'||key==='y'){event.preventDefault();event.stopPropagation();setHistory(key==='y'||event.shiftKey?redo:undo);setMessage('')}
  }} aria-label={historyEnabled?(en?'Interactive Undo/Redo demo':'Интерактивное демо Undo/Redo'):en?'Interactive task dependency demo':'Интерактивное демо зависимостей задач'}>
    <div className="demo-window-bar"><span className="window-dots" aria-hidden="true"><i/><i/><i/></span><span>{historyEnabled?'UNDO / REDO':en?'DEPENDENCY PLAYGROUND':'ДЕМО ЗАВИСИМОСТЕЙ'}</span><span className="demo-live">{en?'INTERACTIVE':'ИНТЕРАКТИВ'}</span></div>
    {historyEnabled && <div className="undo-toolbar"><div><Button size="sm" variant="outline" disabled={!history.past.length} onClick={()=>{setHistory(undo);setMessage('')}}><Undo2 size={14}/>Undo</Button><Button size="sm" variant="outline" disabled={!history.future.length} onClick={()=>{setHistory(redo);setMessage('')}}><Redo2 size={14}/>Redo</Button></div><span aria-live="polite">{en?'Undo':'Отмена'}: {history.past.length} · {en?'Redo':'Повтор'}: {history.future.length}</span><p>{en?'Ctrl/Cmd+Z — Undo · Ctrl/Cmd+Shift+Z or Ctrl+Y — Redo. Click inside this demo first. Each change restores the entire operation, including all dependent tasks.':'Ctrl/Cmd+Z — отменить · Ctrl/Cmd+Shift+Z или Ctrl+Y — повторить. Сначала нажмите внутри демо. Вся операция, включая сдвиг зависимых задач, отменяется целиком.'}</p></div>}
    <div className="gantt-toolbar"><div><Button size="icon" variant="ghost" aria-label={en?'Pan one week left':'На неделю влево'} onClick={()=>setOrigin(origin-7)}><ArrowLeft size={14}/></Button><Button size="icon" variant="ghost" aria-label={en?'Pan one week right':'На неделю вправо'} onClick={()=>setOrigin(origin+7)}><ArrowRight size={14}/></Button><span className="gantt-range">{en?'Days':'Дни'} {Math.floor(origin)}…{Math.ceil(origin+width/scale)}</span></div><div><Button size="icon" variant="ghost" aria-label={en?'Zoom out':'Уменьшить'} onClick={()=>zoom(1/1.3)}><Minus size={14}/></Button><Button size="icon" variant="ghost" aria-label={en?'Zoom in':'Увеличить'} onClick={()=>zoom(1.3)}><Plus size={14}/></Button><Button size="icon" variant="ghost" aria-label={en?'Fit all tasks':'Показать все задачи'} onClick={fit}><Maximize2 size={13}/></Button><Button size="icon" variant="ghost" aria-label={en?'Reset demo':'Сбросить демо'} onClick={reset}><RotateCcw size={13}/></Button></div></div>
    <div className="gantt-chart"><div className="gantt-labels"><div className="gantt-label-header">{en?'TASK / DAY':'ЗАДАЧА / ДЕНЬ'}</div>{tasks.map(task=><button type="button" className={task.id===taskId?'selected':''} key={task.id} onClick={()=>setTaskId(task.id)} style={{height:rowHeight}}>{names[task.id]}</button>)}</div>
      <div ref={timeline} className="gantt-timeline"><svg ref={svg} width="100%" height={height} onPointerDown={event=>startDrag(event,'pan')} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} aria-label={en?'Drag tasks to move, drag their edges to resize, or drag the grid to pan. Focus a task and use arrow keys to move it.':'Перетаскивайте задачи и их края, двигайте сетку. Стрелки перемещают задачу в фокусе.'}>
        <defs>{dependencyTypes.map(type=><marker key={type} id={`${uid}-${type}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto-start-reverse"><path d="M0,0 L6,3 L0,6 Z" fill={colors[type]}/></marker>)}</defs>
        <rect className="gantt-grid-background" width={width} height={height}/>
        {ticks.map(day=><g key={day}><line className={day===0?'gantt-zero':'gantt-grid-line'} x1={x(day)} x2={x(day)} y1={headerHeight} y2={height}/><text className="gantt-tick" x={x(day)+5} y={21}>{day}</text></g>)}
        {tasks.map((task,index)=><rect key={task.id} className={task.id===taskId?'gantt-selected-row':'gantt-row'} x={0} y={headerHeight+index*rowHeight} width={width} height={rowHeight}/>)}
        <g>{links.map(link=>{
          const predecessor=tasks.find(task=>task.id===link.from)!,successor=tasks.find(task=>task.id===link.to)!
          const rawSource=x(predecessor.start+(link.type[0]==='F'?predecessor.duration:0)),rawTarget=x(successor.start+(link.type[1]==='F'?successor.duration:0))
          if((rawSource< -40&&rawTarget< -40)||(rawSource>width+40&&rawTarget>width+40))return null
          const sx=Math.max(-80,Math.min(width+80,rawSource)),tx=Math.max(-80,Math.min(width+80,rawTarget))
          const sy=headerHeight+tasks.indexOf(predecessor)*rowHeight+rowHeight/2,ty=headerHeight+tasks.indexOf(successor)*rowHeight+rowHeight/2
          const path=`M${sx},${sy} C${sx+(link.type[0]==='F'?30:-30)},${sy} ${tx+(link.type[1]==='S'?-30:30)},${ty} ${tx},${ty}`
          return <g key={link.id} className="gantt-dependency" style={{color:colors[link.type]}}><path d={path} fill="none" stroke="currentColor" strokeWidth={link.id===linkId?2:1.3} markerEnd={`url(#${uid}-${link.type})`}/><rect x={(sx+tx)/2-11} y={(sy+ty)/2-8} width={22} height={15} rx={3}/><text x={(sx+tx)/2} y={(sy+ty)/2+3} textAnchor="middle" fill="currentColor">{link.type}</text></g>
        })}</g>
        {tasks.map((task,index)=>{
          const left=x(task.start),barWidth=task.duration*scale,y=headerHeight+index*rowHeight+10
          if(left+barWidth<0||left>width)return null
          return <g key={task.id} className={`gantt-task ${task.id===taskId?'is-active':''}`} role="button" tabIndex={0} aria-label={`${names[task.id]}: ${en?'start':'старт'} ${task.start}, ${en?'duration':'длительность'} ${task.duration}. ${en?'Arrow keys move; Shift+arrow resizes.':'Стрелки — сдвиг; Shift+стрелки — длительность.'}`} onKeyDown={event=>{if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;event.preventDefault();setTaskId(task.id);const delta=event.key==='ArrowLeft'?-1:1;updateTask(task.id,event.shiftKey?{duration:Math.max(1,task.duration+delta)}:{start:task.start+delta})}} onPointerDown={event=>startDrag(event,'move',task.id)}>
            <rect x={left} y={y} width={barWidth} height={23} rx={4}/>
            {barWidth>34&&<text x={left+barWidth/2} y={y+15} textAnchor="middle">{task.duration}{en?'d':'д'}</text>}
            <rect className="gantt-resize" x={left} y={y} width={7} height={23} rx={2} onPointerDown={event=>startDrag(event,'start',task.id)}/>
            <rect className="gantt-resize" x={left+barWidth-7} y={y} width={7} height={23} rx={2} onPointerDown={event=>startDrag(event,'finish',task.id)}/>
          </g>
        })}
      </svg></div></div>
    <div className="gantt-link-legend" aria-label={en?'Choose a dependency to edit':'Выберите связь для редактирования'}>{links.map(link=><button type="button" key={link.id} aria-pressed={link.id===linkId} onClick={()=>setLinkId(link.id)} style={{'--link-color':colors[link.type]} as React.CSSProperties}><span>{link.type}</span>{names[link.from]} → {names[link.to]}</button>)}</div>
    <div className="gantt-editor"><div className="gantt-task-editor"><strong>{names[taskId]}</strong><label>{en?'Start':'Старт'}<input aria-label={en?'Task start day':'День начала задачи'} type="number" value={activeTask.start} onChange={event=>{if(event.target.value!=='')updateTask(taskId,{start:Number(event.target.value)})}}/></label><label>{en?'Duration':'Длительность'}<input aria-label={en?'Task duration':'Длительность задачи'} type="number" min={1} value={activeTask.duration} onChange={event=>{if(event.target.value!=='')updateTask(taskId,{duration:Math.max(1,Number(event.target.value))})}}/></label></div>
    <div className="gantt-link-editor"><label>{en?'Dependency':'Зависимость'}<NativeSelect aria-label={en?'Dependency type':'Тип зависимости'} value={activeLink.type} onChange={event=>updateLink({type:event.target.value as DependencyType})}>{dependencyTypes.map(type=><NativeSelectOption key={type} value={type}>{type}</NativeSelectOption>)}</NativeSelect></label><label>{en?'Lag (days)':'Лаг (дни)'}<input aria-label={en?'Dependency lag in days':'Лаг зависимости в днях'} type="number" value={activeLink.lag} onChange={event=>{if(event.target.value!=='')updateLink({lag:Number(event.target.value)})}}/></label><p>{explanations[activeLink.type]}</p></div></div>
    <p className="gantt-help">{en?'Drag bars or their edges. Drag the grid, use arrows, or Shift+wheel to pan without limits. Constraints push successors forward and retain slack.':'Двигайте задачи и их края. Сетка, стрелки и Shift+колесо перемещают шкалу без границ. Связи сдвигают задачи вперёд, сохраняя запас времени.'}</p>
    <p className="demo-disclaimer" aria-live="polite">{message || (historyEnabled?(en?'Browser simulation of compound-operation history. Production implementation: EF Change Tracker → Redis diff → SignalR; concurrent changes invalidate history.':'Браузерная модель истории составных операций. Production-реализация: EF Change Tracker → diff в Redis → SignalR; конкурентные изменения инвалидируют историю.'):(en?'Illustrative browser demo; not the original production engine.':'Иллюстративное браузерное демо, не исходный production-движок.'))}</p>
  </section>
}
