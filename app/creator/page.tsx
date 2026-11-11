import type { Metadata } from 'next'
import { ArrowUpRight, Mail } from 'lucide-react'
import SiteShell from '@/components/site-shell'
import { APP_ORIGIN } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Meet the Creator | Igira Provisoire',
  description: 'Meet Didier Ineza, the creator and developer behind Igira Provisoire.',
  alternates: { canonical: '/creator' },
}

export default function CreatorPage() {
  return <SiteShell className="creator-page">
    <header className="creator-intro site-container">
      <div className="creator-copy"><span className="site-eyebrow">The person behind Igira</span><h1>One creator.<br />A clearer way to learn.</h1><p className="creator-lead">Meet Didier Ineza, the creator and developer of Igira Provisoire.</p><p>Igira is independently built and maintained by one person, with a focus on making driving theory preparation easier to understand and use.</p><a className="brand-button brand-button-navy" href="mailto:didier@igiraprovisoire.rw">Email Didier <Mail size={17} /></a></div>
      <figure className="creator-portrait"><img src="/didier-ineza.png" alt="Didier Ineza, creator of Igira Provisoire" width={1024} height={1280} /><figcaption><strong>Didier Ineza</strong><span>Creator & developer</span></figcaption></figure>
    </header>
    <section className="creator-story site-section"><div className="site-container creator-story-grid"><h2>It started with<br />a familiar challenge.</h2><div><p>Reading an entire driving theory rulebook can feel overwhelming and time-consuming. That experience inspired Didier to build a simpler, more interactive way to prepare.</p><p>Igira brings practice questions, mock tests and explanations together so learners can build understanding at their own pace—in Kinyarwanda, English or French.</p><p>The aim is straightforward: make preparation clearer, while encouraging learners to understand the rules rather than only memorise answers.</p></div></div></section>
    <section className="site-section site-container creator-support"><div><span className="site-eyebrow">Independent work, practical support</span><h2>Built by Didier.<br />Supported by Sokrab.</h2><p>Sokrab Group supports the platform through hosting infrastructure and technical support. That contribution is recognised separately from the creator’s work.</p><a className="brand-text-link" href="/sponsors">Meet our supporter <ArrowUpRight size={17} /></a></div><div className="creator-support-logo"><img src="/sokrab-logo-black.png" width={280} height={110} alt="Sokrab Group" /><span>Hosting infrastructure & technical support</span></div></section>
    <section className="creator-next"><div className="site-container"><div><h2>Have an idea for Igira?</h2><p>Share feedback, discuss a partnership or try the learning experience.</p></div><div className="site-actions"><a href="mailto:didier@igiraprovisoire.rw" className="brand-text-link">Contact Didier <Mail size={17} /></a><a href={APP_ORIGIN} className="brand-button brand-button-navy">Start learning <ArrowUpRight size={17} /></a></div></div></section>
  </SiteShell>
}
