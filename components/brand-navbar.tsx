'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { ArrowRight, ArrowUpRight, Menu, ShieldCheck, X } from 'lucide-react'
import { APP_ORIGIN } from '@/lib/site-config'

export default function BrandNavbar() {
  const [menu, setMenu] = useState(false)
  const pathname = usePathname()
  const resolveHref = (href: string) => href.startsWith('#') && pathname !== '/' ? `/${href}` : href
  const links = [['About', '#about'], ['How It Works', '#how-it-works'], ['For Driving Schools', '#schools'], ['Blog', '/blog'], ['Creator', '/creator'], ['Sponsors', '/sponsors'], ['Advertise With Us', '/sponsors#advertising']] as const
  return <>
    <div className="brand-utility"><div className="brand-container"><span><ShieldCheck size={14} /> Driving theory preparation for Rwanda</span><a href="mailto:info@igiraprovisoire.rw">info@igiraprovisoire.rw <ArrowUpRight size={13} /></a></div></div>
    <header className="brand-nav"><div className="brand-container brand-nav-inner">
      <a className="brand-logo" href="/#top" aria-label="Igira Provisoire home"><img src="/igira-logo.png" alt="Igira Provisoire" width={160} height={60} /></a>
      <nav className="brand-desktop-nav" aria-label="Main navigation">{links.map(([name, href]) => <a key={name} href={resolveHref(href)}>{name}</a>)}</nav>
      <a href={APP_ORIGIN} className="brand-button brand-button-yellow brand-nav-start">Start learning <ArrowUpRight size={17} /></a>
      <button className="brand-menu-toggle" type="button" aria-expanded={menu} aria-controls="brand-mobile-navigation" aria-label={menu ? 'Close menu' : 'Open menu'} onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
    </div>{menu && <nav className="brand-mobile-nav brand-container" id="brand-mobile-navigation" aria-label="Mobile navigation">{links.map(([name, href]) => <a key={name} href={resolveHref(href)} onClick={() => setMenu(false)}>{name}<ArrowRight size={17} /></a>)}<a href={APP_ORIGIN}>Start learning <ArrowUpRight size={17} /></a></nav>}</header>
  </>
}
