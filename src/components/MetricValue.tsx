import {useEffect, useRef, useState} from 'react'

/** One reveal animation; the accessible value remains the owner's estimate. */
export function MetricValue({value}:{value:string}) {
  const center=useRef<HTMLSpanElement>(null)
  const [entered,setEntered]=useState(false)
  const animated=value==='~54'
  useEffect(()=>{
    if(!animated || entered || window.matchMedia('(prefers-reduced-motion: reduce)').matches)return
    let observer:IntersectionObserver
    function observeCenter(){
      observer?.disconnect()
      const margin=Math.max(0,Math.floor(window.innerHeight/2)-16)
      observer=new IntersectionObserver(entries=>{
        if(entries.some(entry=>entry.isIntersecting)){
          setEntered(true)
          observer.disconnect()
        }
      },{rootMargin:`-${margin}px 0px -${margin}px 0px`,threshold:0})
      if(center.current)observer.observe(center.current)
    }
    observeCenter()
    window.addEventListener('resize',observeCenter)
    return()=>{observer.disconnect();window.removeEventListener('resize',observeCenter)}
  },[animated,entered])
  if(!animated)return <strong>{value}</strong>
  return <><strong className="metric-value" aria-label={value}>
    <span aria-hidden="true">~</span><span className="metric-roll-window" aria-hidden="true"><span className={`metric-roll-track ${entered?'has-entered':''}`}><span>53</span><span>54</span></span></span>
  </strong><span ref={center} className="metric-center-trigger" aria-hidden="true"/></>
}
