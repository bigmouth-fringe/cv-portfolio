import type { Lang } from '../content'
import { LockDemo } from './LockDemo'
import './lock-showcase.css'

export function LockShowcase({ lang }: { lang: Lang }) {
  const en = lang === 'en'
  return <div className="lock-showcase">
    <section className="lock-project-impact" aria-label={en ? 'Locking extension adoption' : 'Масштаб использования расширений'}>
      <div className="lock-impact-head"><span className="section-kicker">{en ? 'CODEBASE ADOPTION' : 'МАСШТАБ В КОДОВОЙ БАЗЕ'}</span><span>WithLock · LockAsync</span></div>
      <div className="lock-project-numbers"><div><strong>35</strong><span>{en ? 'call sites' : 'мест вызова'}</span></div><div><strong>19</strong><span>{en ? 'files using the shared API' : 'файлов используют общий API'}</span></div><div><strong>2</strong><span>{en ? 'extensions replacing repeated SQL' : 'расширения вместо копирования SQL'}</span></div></div>
      <div className="lock-adoption-dots" aria-label={en ? '26 direct calls and 9 shared-helper calls' : '26 прямых вызовов и 9 обращений через общий хелпер'}>{Array.from({ length: 35 }, (_, i) => <i key={i} className={i < 26 ? 'with-lock' : 'lock-async'}/>)}<span>{en ? '26 direct · 9 via shared helper' : '26 прямых · 9 через общий хелпер'}</span></div>
      <div className="lock-migration"><div><p className="section-kicker">{en ? 'VERIFIED REPLACEMENT AT 12 CALL SITES' : 'ПОДТВЕРЖДЁННАЯ ЗАМЕНА В 12 МЕСТАХ'}</p><h3>{en ? 'Repeated SQL removed.' : 'Повторяющийся SQL ушёл.'}<br/>{en ? 'Intent stays in LINQ.' : 'Намерение осталось в LINQ.'}</h3><p>{en ? 'Across three verified changes, twelve Raw SQL fragments were replaced by the shared locking API.' : 'В трёх подтверждённых изменениях двенадцать Raw SQL-фрагментов заменены общим API блокировок.'}</p></div><div className="lock-project-bars"><div><span>{en ? 'Before · Raw SQL' : 'До · Raw SQL'}</span><strong>60 <small>{en ? 'lines' : 'строк'}</small></strong><i className="before-bar"/></div><div><span>{en ? 'After · LockAsync' : 'После · LockAsync'}</span><strong>30 <small>{en ? 'lines' : 'строк'}</small></strong><i className="after-bar"/></div><p><b>−50%</b> {en ? 'application code at these call sites' : 'объёма прикладного кода в этих местах'}</p></div></div>
      <p className="lock-impact-caption">{en ? '35 application call sites across 19 files, including the shared project/version helper. The 12 verified SQL replacements reduced call-site code from 60 to 30 nonblank lines.' : '35 прикладных мест в 19 файлах, включая общий хелпер проекта/версии. В 12 подтверждённых заменах SQL вызывающий код сократился с 60 до 30 непустых строк.'}</p>
    </section>
    <p className="section-kicker lock-example-kicker">{en ? 'AT THE CALL SITE · ILLUSTRATIVE EXAMPLE' : 'КАК ВЫГЛЯДИТ ВЫЗОВ · ИЛЛЮСТРАТИВНЫЙ ПРИМЕР'}</p>
    <LockDemo lang={lang}/>
  </div>
}
