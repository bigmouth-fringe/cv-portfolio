import type { Lang } from '../content'
import { LockDemo } from './LockDemo'
import './lock-showcase.css'

export function LockShowcase({ lang }: { lang: Lang }) {
  const en = lang === 'en'
  return <div className="lock-showcase">
    <section className="lock-project-impact" aria-label={en ? 'Locking extension adoption' : 'Масштаб использования расширений'}>
      <div className="lock-impact-head"><span className="section-kicker">{en ? 'CODEBASE ADOPTION' : 'МАСШТАБ В КОДОВОЙ БАЗЕ'}</span><span>WithLock · LockAsync</span></div>
      <div className="lock-project-numbers"><div><strong>28</strong><span>{en ? 'call sites' : 'мест вызова'}</span></div><div><strong>14</strong><span>{en ? 'files using the shared API' : 'файлов используют общий API'}</span></div><div><strong>2</strong><span>{en ? 'extensions replacing repeated SQL' : 'расширения вместо копирования SQL'}</span></div></div>
      <div className="lock-adoption-dots" aria-label={en ? '6 WithLock calls and 22 LockAsync calls' : '6 вызовов WithLock и 22 вызова LockAsync'}>{Array.from({ length: 28 }, (_, i) => <i key={i} className={i < 6 ? 'with-lock' : 'lock-async'}/>)}<span>6 × WithLock · 22 × LockAsync</span></div>
      <div className="lock-migration"><div><p className="section-kicker">{en ? 'VERIFIED REPLACEMENT AT 10 CALL SITES' : 'ПОДТВЕРЖДЁННАЯ ЗАМЕНА В 10 МЕСТАХ'}</p><h3>{en ? 'Repeated SQL removed.' : 'Повторяющийся SQL ушёл.'}<br/>{en ? 'Intent stays in LINQ.' : 'Намерение осталось в LINQ.'}</h3><p>{en ? 'In one change, the team migrated ten SQL fragments to the shared locking mechanism.' : 'В одном изменении команда перевела десять SQL-фрагментов на общий механизм блокировок.'}</p></div><div className="lock-project-bars"><div><span>{en ? 'Before · Raw SQL' : 'До · Raw SQL'}</span><strong>50 <small>{en ? 'lines' : 'строк'}</small></strong><i className="before-bar"/></div><div><span>{en ? 'After · LockAsync' : 'После · LockAsync'}</span><strong>28 <small>{en ? 'lines' : 'строк'}</small></strong><i className="after-bar"/></div><p><b>−44%</b> {en ? 'application code at these call sites' : 'объёма прикладного кода в этих местах'}</p></div></div>
      <p className="lock-impact-caption">{en ? '28 current call sites across 14 files. The 50 → 28 comparison counts only replaced blocks in one verified change, excluding blank lines. The shared implementation is counted separately.' : 'По текущему коду: 28 вызовов в 14 файлах. Сравнение 50 → 28 — только заменённые блоки в одном подтверждённом изменении, без пустых строк. Реализация общего механизма считается отдельно.'}</p>
    </section>
    <p className="section-kicker lock-example-kicker">{en ? 'AT THE CALL SITE · ILLUSTRATIVE EXAMPLE' : 'КАК ВЫГЛЯДИТ ВЫЗОВ · ИЛЛЮСТРАТИВНЫЙ ПРИМЕР'}</p>
    <LockDemo lang={lang}/>
  </div>
}
