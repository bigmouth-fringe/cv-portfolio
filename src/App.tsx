import { useEffect, useState } from 'react'
import { Architecture } from './components/Architecture'
import { PerformanceVisual } from './components/PerformanceVisual'
import { GanttDemo } from './components/GanttDemo'
import { ArrowUpRight, ArrowDown, Mail, Moon, Sun, Copy, Check, MapPin, Layers, Database, GitBranch } from 'lucide-react'
import { Button } from './components/ui/button'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './components/ui/accordion'
import { type Lang } from './content'
import { profiles, resolveProfile, readProfileId } from './profiles'
import { NativeSelect, NativeSelectOption } from './components/ui/native-select'
const ids=['work','experience','about','contact']
function saved(key:string){try{return localStorage.getItem(key)}catch{return null}}
export default function App(){
 const [lang,setLang]=useState<Lang>(()=>saved('portfolio-language')==='ru'?'ru':'en')
 const [dark,setDark]=useState(()=>saved('portfolio-theme')!=='light')
 const [filter,setFilter]=useState('All')
 const [copied,setCopied]=useState(false)
 const [profileId,setProfileId]=useState(readProfileId)
 const profile=resolveProfile(profileId)
 const t=profile.content[lang]
 const emailHref=`mailto:${profile.email}`
 function switchProfile(id:string){
  const next=resolveProfile(id).id
  const url=new URL(window.location.href)
  url.searchParams.set('cv',next)
  window.history.pushState({},'',url)
  setProfileId(next)
  setFilter('All')
  setCopied(false)
 }
 useEffect(()=>{
  function onHistory(){setProfileId(readProfileId());setFilter('All');setCopied(false)}
  window.addEventListener('popstate',onHistory)
  return()=>window.removeEventListener('popstate',onHistory)
 },[])
 useEffect(()=>{
  try{localStorage.setItem('portfolio-cv',profileId)}catch{}
  const url=new URL(window.location.href)
  if(url.searchParams.get('cv')!==profileId){url.searchParams.set('cv',profileId);window.history.replaceState({},'',url)}
 },[profileId])
 useEffect(()=>{document.documentElement.lang=lang;document.title=profile.label[lang];document.querySelector('meta[name="description"]')?.setAttribute('content',profile.description[lang]);try{localStorage.setItem('portfolio-language',lang)}catch{}},[lang,t.name,profile])
 useEffect(()=>{document.documentElement.classList.toggle('dark',dark);try{localStorage.setItem('portfolio-theme',dark?'dark':'light')}catch{}},[dark])
 useEffect(()=>{if(!copied)return;const timer=setTimeout(()=>setCopied(false),2000);return()=>clearTimeout(timer)},[copied])
 async function copy(){try{await navigator.clipboard.writeText(profile.email);setCopied(true)}catch{window.location.href=emailHref}}
 const icons=[GitBranch,Layers,Database]
 return <><a className="skip-link" href="#main">{lang==='en'?'Skip to content':'Перейти к содержимому'}</a><header className="site-header"><a className="wordmark" href="#" aria-label={t.name}>{profile.initials}<span>.</span></a><nav aria-label={lang==='en'?'Main navigation':'Главная навигация'}>{t.nav.map((n,i)=><a href={`#${ids[i]}`} key={n}>{n}</a>)}</nav><div className="controls"><Button variant="ghost" size="sm" onClick={()=>setLang(lang==='en'?'ru':'en')} aria-label={t.language}><span className={lang==='en'?'active-lang':''}>EN</span><span className="dim">/</span><span className={lang==='ru'?'active-lang':''}>RU</span></Button><Button variant="ghost" size="icon" onClick={()=>setDark(!dark)} aria-label={t.theme}>{dark?<Sun size={17}/>:<Moon size={17}/>}</Button></div></header>
 <main id="main"><div className="cv-switcher"><div className="cv-choice"><label htmlFor="cv-profile">{lang==='en'?'CV profile':'Версия резюме'}</label><NativeSelect id="cv-profile" value={profileId} onChange={event=>switchProfile(event.target.value)}>{profiles.map(item=><NativeSelectOption key={item.id} value={item.id}>{item.label[lang]}</NativeSelectOption>)}</NativeSelect></div>{profiles.length>1 && <span className="cv-count">{String(profiles.findIndex(item=>item.id===profileId)+1).padStart(2,'0')} / {String(profiles.length).padStart(2,'0')}</span>}</div><div key={profileId}><section className="hero"><div className="hero-copy"><p className="eyebrow"><span className="status-dot"/>{t.eyebrow}</p><p className="hero-name">{t.name}</p><h1>{t.headline[0]}<br/><span>{t.headline[1]}</span></h1><p className="role">{t.role}</p><p className="intro">{t.intro}</p><div className="hero-actions"><Button asChild><a href="#work">{t.work}<ArrowDown size={16}/></a></Button><Button asChild variant="outline"><a href={emailHref}>{t.contact}<ArrowUpRight size={16}/></a></Button></div><p className="location"><MapPin size={14}/>{t.location}</p></div><Architecture model={profile.architecture} lang={lang}/></section>
 <section className="metrics" aria-label={lang==='en'?'Career highlights':'Ключевые результаты'}>{t.metrics.map(([value,label])=><div key={label}><strong>{value}</strong><span>{label}</span></div>)}</section>
 <section id="work" className="section"><div className="section-kicker">01 / {t.nav[0]}</div><div className="section-heading"><h2>{t.selected}</h2><p>{t.selectedIntro}</p></div><div className="filters" aria-label={lang==='en'?'Filter case studies':'Фильтр задач'}>{['All','Architecture','Performance','Reliability'].map((key,i)=><Button key={key} size="sm" variant={filter===key?'default':'ghost'} aria-pressed={filter===key} onClick={()=>setFilter(key)}>{i===0?t.all:t.filters[i-1]}</Button>)}</div><div className="case-list">{t.cases.filter(c=>filter==='All'||filter===c.category).map(c=>{const Icon=icons[Number(c.number)-1] ?? Layers;return <article className={`case ${c.demo ? 'case-with-demo' : ''}`} key={c.number}><div className="case-index"><span>{c.number}</span><Icon size={26}/></div><div className="case-main"><p className="case-company">{c.company}</p><div className="tags">{c.tags.map(tag=><span key={tag}>{tag}</span>)}</div><h3>{c.title}</h3><p>{c.summary}</p><Accordion type="single" collapsible><AccordionItem value={c.number}><AccordionTrigger>{t.details}</AccordionTrigger><AccordionContent><div className="case-detail">{[c.problem,c.approach,c.result].map((text,i)=><div key={i}><h4>{t.labels[i]}</h4><p>{text}</p></div>)}</div></AccordionContent></AccordionItem></Accordion></div>{(c.demo==='gantt'||c.demo==='undo') && <GanttDemo lang={lang} historyEnabled={c.demo==='undo'}/>} {c.demo==='performance' && <PerformanceVisual lang={lang}/>}</article>})}</div></section>
 <section id="experience" className="section"><div className="section-kicker">02 / {t.nav[1]}</div><h2>{t.experience}</h2><div className="timeline">{t.jobs.map((job,i)=><article className="job" key={job.company}><div className="job-date"><span className="timeline-dot"/>{job.date}</div><div><div className="job-heading"><h3>{job.company}</h3><span className="job-number">0{i+1}</span></div><h4>{job.role}</h4><>{job.text && <p>{job.text}</p>}<ul className="job-bullets">{job.bullets.map(bullet=><li key={bullet}>{bullet}</li>)}</ul></><p className="job-stack">{job.stack}</p></div></article>)}</div></section>
 <section id="about" className="section about"><div><div className="section-kicker">03 / {t.nav[2]}</div><h2>{t.about}</h2>{t.aboutParagraphs.map(paragraph=><p key={paragraph}>{paragraph}</p>)}<div className="education"><span className="eyebrow">{t.education}</span><p>{t.degree}</p><p>{t.languages}</p></div></div><div className="toolkit"><span className="eyebrow">{t.skills}</span>{profile.toolkit.map(group=><div className="skill-group" key={group.label.en}><h3>{group.label[lang]}</h3><div className="tags">{group.skills.map(skill=><span key={skill}>{skill}</span>)}</div></div>)}</div></section>
 <section id="contact" className="contact-section"><div className="section-kicker">04 / {t.nav[3]}</div><h2>{t.contactTitle}</h2><p>{t.contactText}</p><div className="contact-actions"><Button asChild><a href={emailHref}><Mail size={16}/>{t.email}<ArrowUpRight size={16}/></a></Button>{profile.telegram && <Button asChild variant="outline"><a href={profile.telegram} target="_blank" rel="noreferrer">{t.telegram}<ArrowUpRight size={16}/></a></Button>}<Button variant="ghost" onClick={copy}>{copied?<Check size={16}/>:<Copy size={16}/>}<span aria-live="polite">{copied?t.copied:t.copy}</span></Button></div><a className="email-address" href={emailHref}>{profile.email}</a></section></div></main><footer><span>© {new Date().getFullYear()} {t.name}</span><span>{t.footer}</span><a href="#">↑ {lang==='en'?'Back to top':'Наверх'}</a></footer></>
}
