import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { Button } from './ui/button'
import type { Lang } from '../content'
import './engineering-demo.css'
import './experience-demo.css'

export function ExperienceDemo({ lang }: { kind: string; lang: Lang }) {
  const en = lang === 'en'
  const [pins, setPins] = useState([{ x: 30, y: 37 }, { x: 66, y: 64 }])
  const [selected, setSelected] = useState(0)
  const label = (a: string, b: string) => en ? a : b
  const caption = label('Interactive illustration of the work described, not the original product.', 'Интерактивный пример описанной задачи, а не исходный продукт.')
  return <section className="engineering-demo experience-demo" aria-label={label('Map annotations demo', 'Демо аннотаций карты')}>
    <div className="sdk-title"><span>MAP / ANNOTATIONS</span><span>Arview</span></div>
    <div className="engineering-controls"><span>{label('Click the map to add a marker', 'Нажмите на карту, чтобы добавить метку')}</span><Button size="sm" variant="ghost" onClick={() => { setPins([]); setSelected(-1) }}>{label('Clear', 'Очистить')}</Button></div>
    <button className="annotation-map" aria-label={label('Add marker to map', 'Добавить метку на карту')} onClick={e => { const rect = e.currentTarget.getBoundingClientRect(); const keyboard = e.detail === 0; setPins([...pins, { x: keyboard ? 50 : (e.clientX - rect.left) / rect.width * 100, y: keyboard ? 50 : (e.clientY - rect.top) / rect.height * 100 }]); setSelected(pins.length) }}>
      <svg viewBox="0 0 400 230" preserveAspectRatio="none" aria-hidden="true"><rect width="400" height="230" fill="#203e3a"/><path d="M240-30Q180 60 245 125T230 260" stroke="#377281" strokeWidth="45" fill="none"/><g stroke="#9cae9f" strokeWidth="9" fill="none"><path d="M-20 80 420 175M80-20 160 250M330-20 300 250M-20 190 420 50"/></g><g stroke="#d6d8bb" strokeWidth="2" fill="none"><path d="M-20 80 420 175M80-20 160 250M330-20 300 250M-20 190 420 50"/></g></svg>
      {pins.map((pin, i) => <span key={i} className={`annotation-pin ${i === selected ? 'selected' : ''}`} style={{ left: `${pin.x}%`, top: `${pin.y}%` }}><MapPin size={25}/><b>{i + 1}</b></span>)}
    </button>
    <div className="annotation-list">{pins.map((_, i) => <Button key={i} variant={selected === i ? 'default' : 'outline'} size="sm" onClick={() => setSelected(i)}>{label('Marker', 'Метка')} {i + 1}</Button>)}</div><p className="engineering-caption">{caption} {label('Schematic map; no external map service.', 'Схематичная карта.')}</p>
  </section>

}
