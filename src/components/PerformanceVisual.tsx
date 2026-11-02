import type { Lang } from '../content'

export function PerformanceVisual({lang}:{lang:Lang}) {
  const en=lang==='en'
  return <figure className="performance-visual" aria-label={en?'Performance improvements at Timetta':'Результаты оптимизации в Timetta'}>
    <figcaption>{en?'TIMETTA / PERFORMANCE':'TIMETTA / ПРОИЗВОДИТЕЛЬНОСТЬ'}</figcaption>
    <div className="performance-comparison"><h4>{en?'P&L calculation time':'Время расчёта P&L'} <strong>2× {en?'faster':'быстрее'}</strong></h4>
      <div className="comparison-row"><span>{en?'Before':'До'}</span><i style={{width:'100%'}}/><b>100%</b></div>
      <div className="comparison-row improved"><span>{en?'After':'После'}</span><i style={{width:'50%'}}/><b>50%</b></div>
      <p>{en?'Separated loading from calculation, extracted reusable components, optimized SQL.':'Разделил загрузку и вычисления, выделил переиспользуемые компоненты, оптимизировал SQL.'}</p>
    </div>
    <div className="performance-comparison"><h4>{en?'Resource planning storage':'Хранение ресурсных планов'} <strong>~10× {en?'smaller':'меньше'}</strong></h4>
      <div className="storage-blocks" aria-hidden="true">{Array.from({length:10},(_,i)=><i key={i} className={i===0?'retained':''}/>)}</div>
      <p>{en?'Contributed to compressed storage and aggregations; analyzed indexes and query plans. Reads improved from minutes to seconds.':'Участвовал в реализации сжатого хранения и агрегаций; анализировал индексы и планы запросов. Чтение ускорилось с минут до секунд.'}</p>
    </div>
    <small>{en?'Relative comparisons; not a live benchmark.':'Относительное сравнение результатов.'}</small>
  </figure>
}
