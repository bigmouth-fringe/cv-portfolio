import { useState, type PointerEvent } from 'react'
import { ArrowUp, ArrowDown, GripVertical, Plus, Trash2 } from 'lucide-react'
import { Button } from './ui/button'
import type { Lang } from '../content'
import './engineering-demo.css'
import './builder-demo.css'

type Block = { id: number; text: string; container: number }
export function BuilderDemo({ lang }: { lang: Lang }) {
  const en = lang === 'en'
  const l = (a: string, b: string) => en ? a : b
  const [preview, setPreview] = useState(false)
  const [containers, setContainers] = useState([1,2])
  const [blocks, setBlocks] = useState<Block[]>([{id:1,text:'Build something useful',container:1},{id:2,text:'From an idea to a working product.',container:1},{id:3,text:'Make it your own',container:2}])
  const [selected, setSelected] = useState(1)
  const [dragging, setDragging] = useState<{type:'container'|'block';id:number}|null>(null)
  const active = blocks.find(b => b.id === selected)
  function moveContainer(id:number, delta:number) { setContainers(current => {const next=[...current]; const index=next.indexOf(id), target=index+delta; if(target<0||target>=next.length)return current; [next[index],next[target]]=[next[target],next[index]];return next}) }
  function moveBlock(id:number, delta:number) { setBlocks(current => {const next=[...current];const index=next.findIndex(b=>b.id===id); const siblings=next.filter(b=>b.container===next[index].container);const target=siblings[siblings.findIndex(b=>b.id===id)+delta];if(!target)return current;const j=next.findIndex(b=>b.id===target.id);[next[index],next[j]]=[next[j],next[index]];return next}) }
  function startDrag(event: PointerEvent<HTMLElement>, source: {type:'container'|'block';id:number}) {
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging(source)
  }
  function finishDrag(event: PointerEvent<HTMLElement>) {
    if (!dragging) return
    const target = document.elementFromPoint(event.clientX, event.clientY)
    const targetContainer = Number(target?.closest('[data-container]')?.getAttribute('data-container'))
    const targetBlock = Number(target?.closest('[data-block]')?.getAttribute('data-block'))
    if (dragging.type === 'block' && targetContainer) {
      setBlocks(current => {
        const source = current.find(b => b.id === dragging.id)
        if (!source || targetBlock === source.id) return current
        const next = current.filter(b => b.id !== source.id)
        const at = targetBlock ? next.findIndex(b => b.id === targetBlock) : -1
        if (at >= 0) next.splice(at, 0, {...source, container:targetContainer})
        else next.push({...source, container:targetContainer})
        return next
      })
    } else if (dragging.type === 'container' && targetContainer && targetContainer !== dragging.id) {
      setContainers(current => {const next=current.filter(id=>id!==dragging.id);next.splice(next.indexOf(targetContainer),0,dragging.id);return next})
    }
    setDragging(null)
  }
  return <section className="engineering-demo builder-demo" aria-label={l('Page builder demo','Демо конструктора страниц')}>
    <div className="demo-window-bar"><span className="window-dots" aria-hidden="true"><i/><i/><i/></span><span>WYSIWYG / PAGE BUILDER</span></div>
    <div className="engineering-controls"><Button size="sm" variant={!preview?'default':'ghost'} aria-pressed={!preview} onClick={()=>setPreview(false)}>{l('Build','Конструктор')}</Button><Button size="sm" variant={preview?'default':'ghost'} aria-pressed={preview} onClick={()=>setPreview(true)}>{l('Preview','Просмотр')}</Button>{!preview && <Button size="sm" variant="outline" onClick={()=>{const id=Math.max(0,...blocks.map(b=>b.id))+1;setBlocks([...blocks,{id,text:l('New heading','Новый заголовок'),container:containers[0]}]);setSelected(id)}}><Plus size={12}/>{l('Heading','Заголовок')}</Button>}</div>
    {!preview && <div className="builder-properties"><label>{l('Selected heading','Выбранный заголовок')}<input aria-label={l('Heading text','Текст заголовка')} value={active?.text??''} disabled={!active} maxLength={100} onChange={e=>setBlocks(blocks.map(b=>b.id===selected?{...b,text:e.target.value}:b))}/></label><label>{l('Container','Контейнер')}<select aria-label={l('Heading container','Контейнер заголовка')} value={active?.container??containers[0]} disabled={!active} onChange={e=>setBlocks(blocks.map(b=>b.id===selected?{...b,container:Number(e.target.value)}:b))}>{containers.map(id=><option key={id} value={id}>{l('Container','Контейнер')} {id}</option>)}</select></label></div>}
    <div className={`builder-canvas ${preview?'is-preview':''}`}>
      {containers.map((id,index)=><div key={id} className={`builder-container container-${id}`} data-container={id} draggable={false} onDragStart={e=>{if(e.target!==e.currentTarget)return;setDragging({type:'container',id});e.dataTransfer.effectAllowed='move'}} onDragOver={e=>{if(!preview)e.preventDefault()}} onDrop={e=>{e.preventDefault();e.stopPropagation();if(dragging?.type==='block')setBlocks(blocks.map(b=>b.id===dragging.id?{...b,container:id}:b));else if(dragging?.type==='container'&&dragging.id!==id){const next=[...containers];next.splice(next.indexOf(dragging.id),1);next.splice(next.indexOf(id),0,dragging.id);setContainers(next)}setDragging(null)}} onDragEnd={()=>setDragging(null)}>
        {!preview && <div className="builder-container-bar"><span className="builder-grip" onPointerDown={e=>startDrag(e,{type:'container',id})} onPointerUp={finishDrag} onPointerCancel={()=>setDragging(null)}><GripVertical size={13}/>{l('Container','Контейнер')} {id}</span><div><Button size="icon" variant="ghost" disabled={index===0} aria-label={`${l('Move container up','Контейнер выше')} ${id}`} onClick={()=>moveContainer(id,-1)}><ArrowUp size={12}/></Button><Button size="icon" variant="ghost" disabled={index===containers.length-1} aria-label={`${l('Move container down','Контейнер ниже')} ${id}`} onClick={()=>moveContainer(id,1)}><ArrowDown size={12}/></Button></div></div>}
        {blocks.filter(b=>b.container===id).map((b,i,group)=><div key={b.id} data-block={b.id} className={`builder-block ${b.id===selected&&!preview?'selected':''}`} draggable={false} onDragStart={e=>{e.stopPropagation();setDragging({type:'block',id:b.id});e.dataTransfer.effectAllowed='move'}} onDragOver={e=>{if(!preview)e.preventDefault()}} onDrop={e=>{if(dragging?.type!=='block')return;e.preventDefault();e.stopPropagation();const next=blocks.filter(x=>x.id!==dragging.id);const source=blocks.find(x=>x.id===dragging.id);if(source){next.splice(next.findIndex(x=>x.id===b.id),0,{...source,container:id});setBlocks(next)}setDragging(null)}}>
          {preview ? <h4>{b.text}</h4> : <><button className="builder-select" onClick={()=>setSelected(b.id)} aria-label={`${l('Select heading','Выбрать заголовок')} ${b.id}`}><span className="builder-grip" onPointerDown={e=>startDrag(e,{type:'block',id:b.id})} onPointerUp={finishDrag} onPointerCancel={()=>setDragging(null)}><GripVertical size={12}/></span><span>{b.text||l('Empty heading','Пустой заголовок')}</span></button><div className="builder-block-actions"><Button size="icon" variant="ghost" disabled={i===0} aria-label={`${l('Move heading up','Заголовок выше')} ${b.id}`} onClick={()=>moveBlock(b.id,-1)}><ArrowUp size={11}/></Button><Button size="icon" variant="ghost" disabled={i===group.length-1} aria-label={`${l('Move heading down','Заголовок ниже')} ${b.id}`} onClick={()=>moveBlock(b.id,1)}><ArrowDown size={11}/></Button><Button size="icon" variant="ghost" aria-label={`${l('Delete heading','Удалить заголовок')} ${b.id}`} onClick={()=>setBlocks(blocks.filter(x=>x.id!==b.id))}><Trash2 size={11}/></Button></div></>}
        </div>)}
        {!blocks.some(b=>b.container===id)&&!preview&&<p className="builder-empty">{l('Drop a heading here','Перетащите сюда заголовок')}</p>}
      </div>)}
    </div>
    <p className="engineering-caption">{preview?l('The page you built. Return to Build to change its structure.','Собранная страница. Вернитесь в конструктор, чтобы изменить структуру.'):l('Drag containers and headings. Use arrows and the container selector as keyboard alternatives. Illustrative editor.','Перетаскивайте контейнеры и заголовки. Для клавиатуры доступны стрелки и выбор контейнера. Демонстрационный редактор.')}</p>
  </section>
}
