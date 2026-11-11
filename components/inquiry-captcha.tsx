'use client'
import { useEffect, useRef } from 'react'

type Turnstile = { render: (node: HTMLElement, options: Record<string, unknown>) => string; remove: (id: string) => void }
declare global { interface Window { turnstile?: Turnstile } }
let loading: Promise<void> | undefined
function load() {
  if (window.turnstile) return Promise.resolve()
  return loading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true; script.onload = () => resolve()
    script.onerror = () => { loading = undefined; script.remove(); reject(Error('Security check unavailable.')) }
    document.head.appendChild(script)
  })
}
export default function InquiryCaptcha({siteKey, onToken, revision}: {siteKey: string; onToken: (token: string) => void; revision: number}) {
  const node = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let cancelled = false; let id: string | undefined
    load().then(() => {
      if (!cancelled && node.current) id = window.turnstile?.render(node.current,{sitekey:siteKey,action:'partnership-inquiry',callback:onToken,'expired-callback':()=>onToken(''),'error-callback':()=>onToken(''),size:'flexible'})
    }).catch(()=>onToken(''))
    return () => { cancelled = true; if(id) window.turnstile?.remove(id) }
  },[siteKey,onToken,revision])
  return <div ref={node} className="inquiry-captcha" />
}
