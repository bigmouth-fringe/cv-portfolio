import { useEffect, useState } from 'react'
import { RotateCcw, RotateCw, ZoomIn, ZoomOut, Check, ArrowRight, MapPin } from 'lucide-react'
import { Button } from './ui/button'
import type { Lang } from '../content'
import './engineering-demo.css'
import './experience-demo.css'

export function ExperienceDemo({ kind, lang }: { kind: string; lang: Lang }) {
  const en = lang === 'en'
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [checked, setChecked] = useState(false)
  const [bold, setBold] = useState(true)
  const [accent, setAccent] = useState(false)
  const [plugin, setPlugin] = useState(false)
  const [title, setTitle] = useState('Project brief')
  const [pins, setPins] = useState([{ x: 30, y: 37 }, { x: 66, y: 64 }])
  const [selected, setSelected] = useState(0)
  const [queue, setQueue] = useState(['evt-101', 'evt-102', 'evt-101'])
  const [processed, setProcessed] = useState<string[]>([])
  const [retry, setRetry] = useState(true)
  const [log, setLog] = useState('')
  useEffect(() => setLog(''), [lang])
  const label = (a: string, b: string) => en ? a : b
  const caption = label('Interactive illustration of the work described, not the original product.', 'Интерактивный пример описанной задачи, а не исходный продукт.')

  if (kind === 'viewer') return <section className="engineering-demo experience-demo" aria-label={label('Image viewer demo', 'Демо просмотра изображений')}>
    <div className="sdk-title"><span>VIEWPORT / TRANSFORMS</span><span>Arcadia</span></div>
    <div className="engineering-controls">
      <Button variant="outline" size="sm" aria-label={label('Zoom out', 'Уменьшить')} disabled={zoom <= .75} onClick={() => { setZoom(Math.max(.75, zoom - .25)); setChecked(false) }}><ZoomOut size={14}/></Button>
      <Button variant="outline" size="sm" aria-label={label('Zoom in', 'Увеличить')} disabled={zoom >= 2} onClick={() => { setZoom(Math.min(2, zoom + .25)); setChecked(false) }}><ZoomIn size={14}/></Button>
      <Button variant="outline" size="sm" aria-label={label('Rotate image', 'Повернуть изображение')} onClick={() => { setRotation(rotation + 90); setChecked(false) }}><RotateCw size={14}/></Button>
      <Button variant="ghost" size="sm" onClick={() => { setZoom(1); setRotation(0); setChecked(false) }}><RotateCcw size={13}/>{label('Reset', 'Сбросить')}</Button>
    </div>
    <div className="viewer-stage"><svg role="img" aria-label={label('Sample landscape', 'Пример пейзажа')} viewBox="0 0 320 180" style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}><rect width="320" height="180" fill="#153e47"/><circle cx="245" cy="42" r="19" fill="#e6b86b"/><path d="M0 150 80 44 159 144 226 78 320 165V180H0Z" fill="#427c7d"/><path d="m0 175 111-67 88 70 74-44 47 40v6H0Z" fill="#72b3a0"/><path d="m62 68 18-24 21 27-22-7Z" fill="#c6e0d6"/></svg></div>
    <div className="viewer-status"><code>{Math.round(zoom * 100)}% · {rotation % 360}°</code><Button size="sm" variant="outline" onClick={() => setChecked(true)}><Check size={13}/>{label('Check viewport', 'Проверить viewport')}</Button></div>
    <pre className="engineering-query" aria-live="polite">{checked ? `✓ zoom = ${zoom}\n✓ rotation = ${rotation % 360}°\n✓ ${label('viewport clips image overflow', 'viewport обрезает выходящие за границы части')}` : label('Transform the image, then inspect its state.', 'Измените изображение и проверьте его состояние.')}</pre>
    <p className="engineering-caption">{caption}</p>
  </section>

  if (kind === 'editor') return <section className="engineering-demo experience-demo" aria-label={label('Editor demo', 'Демо редактора')}>
    <div className="sdk-title"><span>WYSIWYG / EXTENSIONS</span><span>VDOM BOX</span></div>
    <div className="engineering-controls"><Button variant={bold ? 'default' : 'outline'} size="sm" aria-pressed={bold} onClick={() => setBold(!bold)}><span aria-label={label('Bold', 'Жирный')}><b>B</b></span></Button><Button variant={accent ? 'default' : 'outline'} size="sm" aria-pressed={accent} onClick={() => setAccent(!accent)}>{label('Accent', 'Акцент')}</Button><label><input type="checkbox" checked={plugin} onChange={e => setPlugin(e.target.checked)}/>{label('Status plugin', 'Плагин статуса')}</label></div>
    <div className="editor-sheet"><label>{label('Editable heading', 'Редактируемый заголовок')}<input value={title} maxLength={55} onChange={e => setTitle(e.target.value)} style={{ fontWeight: bold ? 700 : 400, color: accent ? 'var(--primary)' : 'var(--foreground)' }}/></label><p>{label('A document assembled from editable blocks. Change the heading and toggle an extension.', 'Документ из редактируемых блоков. Измените заголовок и подключите расширение.')}</p>{plugin && <div className="editor-plugin"><Check size={14}/>{label('Ready for review', 'Готово к проверке')}</div>}</div>
    <pre className="engineering-query">{`Document\n ├─ Heading [${bold ? 'bold' : 'regular'}${accent ? ', accent' : ''}]\n ├─ Paragraph${plugin ? '\n └─ StatusPlugin → ready' : ''}`}</pre><p className="engineering-caption">{caption}</p>
  </section>

  if (kind === 'map') return <section className="engineering-demo experience-demo" aria-label={label('Map annotations demo', 'Демо аннотаций карты')}>
    <div className="sdk-title"><span>MAP / ANNOTATIONS</span><span>Arview</span></div>
    <div className="engineering-controls"><span>{label('Click the map to add a marker', 'Нажмите на карту, чтобы добавить метку')}</span><Button size="sm" variant="ghost" onClick={() => { setPins([]); setSelected(-1) }}>{label('Clear', 'Очистить')}</Button></div>
    <button className="annotation-map" aria-label={label('Add marker to map', 'Добавить метку на карту')} onClick={e => { const rect = e.currentTarget.getBoundingClientRect(); const keyboard = e.detail === 0; setPins([...pins, { x: keyboard ? 50 : (e.clientX - rect.left) / rect.width * 100, y: keyboard ? 50 : (e.clientY - rect.top) / rect.height * 100 }]); setSelected(pins.length) }}>
      <svg viewBox="0 0 400 230" preserveAspectRatio="none" aria-hidden="true"><rect width="400" height="230" fill="#203e3a"/><path d="M240-30Q180 60 245 125T230 260" stroke="#377281" strokeWidth="45" fill="none"/><g stroke="#9cae9f" strokeWidth="9" fill="none"><path d="M-20 80 420 175M80-20 160 250M330-20 300 250M-20 190 420 50"/></g><g stroke="#d6d8bb" strokeWidth="2" fill="none"><path d="M-20 80 420 175M80-20 160 250M330-20 300 250M-20 190 420 50"/></g></svg>
      {pins.map((pin, i) => <span key={i} className={`annotation-pin ${i === selected ? 'selected' : ''}`} style={{ left: `${pin.x}%`, top: `${pin.y}%` }}><MapPin size={25}/><b>{i + 1}</b></span>)}
    </button>
    <div className="annotation-list">{pins.map((_, i) => <Button key={i} variant={selected === i ? 'default' : 'outline'} size="sm" onClick={() => setSelected(i)}>{label('Marker', 'Метка')} {i + 1}</Button>)}</div><p className="engineering-caption">{caption} {label('Schematic map; no external map service.', 'Схематичная карта.')}</p>
  </section>

  function deliver() {
    const id = queue[0]
    if (!id) return
    if (id === 'evt-102' && retry) { setRetry(false); setQueue([...queue.slice(1), id]); setLog(label(`${id}: temporary failure → requeued`, `${id}: временная ошибка → повторная доставка`)); return }
    setQueue(queue.slice(1))
    if (processed.includes(id)) setLog(label(`${id}: duplicate → skipped`, `${id}: дубликат → пропущен`))
    else { setProcessed([...processed, id]); setLog(label(`${id}: applied`, `${id}: применено`)) }
  }
  return <section className="engineering-demo experience-demo" aria-label={label('Message delivery demo', 'Демо доставки сообщений')}>
    <div className="sdk-title"><span>ASYNC / IDEMPOTENCY</span><span>Timetta</span></div>
    <div className="engineering-controls"><Button size="sm" disabled={!queue.length} onClick={deliver}>{label('Deliver next', 'Доставить следующее')}<ArrowRight size={13}/></Button><Button variant="ghost" size="sm" onClick={() => { setQueue(['evt-101', 'evt-102', 'evt-101']); setProcessed([]); setRetry(true); setLog('') }}><RotateCcw size={13}/>{label('Reset', 'Сбросить')}</Button></div>
    <div className="delivery-lanes"><div><h4>{label('Queue', 'Очередь')} · {queue.length}</h4>{queue.map((id, i) => <code key={`${id}-${i}`}>{id}{i === 0 && <ArrowRight size={12}/>}</code>)}{!queue.length && <p>{label('Empty', 'Пусто')}</p>}</div><div><h4>{label('Applied once', 'Применено один раз')} · {processed.length}</h4>{processed.map(id => <code key={id}><Check size={13}/>{id}</code>)}</div></div>
    <pre className="engineering-query delivery-log" aria-live="polite">{log || label('Includes a duplicate and a transient failure.', 'В очереди есть дубликат и временная ошибка.')}</pre><p className="engineering-caption">{caption} {label('Retries may deliver a message again; idempotent handling prevents applying its effect twice.', 'Повторная доставка возможна; идемпотентный обработчик не применяет изменение дважды.')}</p>
  </section>
}

