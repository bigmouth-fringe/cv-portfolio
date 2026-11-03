import {useEffect, useRef, useState} from 'react'

/** One reveal animation; the accessible value remains the owner's estimate. */
export function MetricValue({value}:{value:string}) {
  const element=useRef<HTMLElement>(null)
  const [entered,setEntered]=useState(false)
  const animated=value==='~50'
  useEffect(()=>{
    if(!animated || window.matchMedia('(prefers-reduced-motion: reduce)').matches)return
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){
        setEntered(true)
        observer.disconnect()
      }
    },{threshold:0.75})
    if(element.current)observer.observe(element.current)
    return()=>observer.disconnect()
  },[animated])
  if(!animated)return <strong>{value}</strong>
  return <strong ref={element} className="metric-value" aria-label={value}>
    <span aria-hidden="true">~</span><span className="metric-roll-window" aria-hidden="true"><span className={`metric-roll-track ${entered?'has-entered':''}`}><span>49</span><span>50</span></span></span>
  </strong>
}
