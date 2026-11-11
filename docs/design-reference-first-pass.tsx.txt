'use client'

import { useState } from 'react'
import { ArrowRight, ArrowUpRight, BookOpen, Check, Languages, Timer } from 'lucide-react'
import { LandingNavbar, Footer, BlogPreview } from '@/components/landing-page'
import { APP_ORIGIN } from '@/lib/site-config'

const previews = [
  { label: 'Practice', image: '/screens-desktop-practice.png', caption: 'Build understanding, one question at a time.' },
  { label: 'Mock tests', image: '/screens-test-desktop.png', caption: 'Get comfortable with a timed examination.' },
  { label: 'On mobile', image: '/screens-practice-mobile.png', caption: 'Make a little room for learning, wherever you are.' },
] as const

export default function PremiumLandingPage() {
  const [preview, setPreview] = useState(0)
  const current = previews[preview]
  return <main className="premium-page">
    <LandingNavbar />
    <section className="premium-hero" id="top">
      <div className="container premium-hero-heading">
        <div className="premium-intro"><span className="premium-status-dot" /> Driving theory, made clearer</div>
        <div className="premium-hero-grid">
          <h1>Know the rules.<br />Own the road.</h1>
          <div className="premium-hero-summary">
            <p>A clearer way to prepare for Rwanda’s driving theory test. Learn the rules, practise your knowledge and take your next step with confidence.</p>
            <a className="button button-yellow" href={APP_ORIGIN}>Start learning <ArrowUpRight size={18} /></a>
            <a className="premium-quiet-link" href="#product">Take a look inside <ArrowRight size={16} /></a>
            <div className="premium-language-note"><Languages size={16} /> English, Français & Kinyarwanda</div>
          </div>
        </div>
      </div>
      <div className="container premium-workspace" id="product">
        <div className="premium-workspace-bar">
          <span className="premium-workspace-title"><span className="premium-app-mark">i</span> Your learning space</span>
          <div className="premium-preview-tabs" role="group" aria-label="Choose a product preview">
            {previews.map((item, index) => <button key={item.label} type="button" aria-pressed={preview === index} onClick={() => setPreview(index)}>{item.label}</button>)}
          </div>
          <span className="premium-preview-label">Product preview</span>
        </div>
        <div className={`premium-screen ${preview === 2 ? 'premium-screen-mobile' : ''}`}>
          <img src={current.image} alt={`Igira Provisoire ${current.label.toLowerCase()} interface`} width={1440} height={900} fetchPriority="high" />
        </div>
        <div className="premium-workspace-caption" aria-live="polite"><span>{current.caption}</span><a href={APP_ORIGIN}>Open Igira <ArrowUpRight size={15} /></a></div>
      </div>
    </section>
    <div className="premium-support-strip"><div className="container"><p>Built for learners in Rwanda.<br /><strong>Supported by people who believe in it.</strong></p><a href="https://sokrab.com/home" target="_blank" rel="noopener noreferrer"><span>Hosting supported by</span><img src="/sokrab-logo-black.png" alt="Sokrab Group" width={160} height={50} /><ArrowUpRight size={17} /></a></div></div>
    <section className="container premium-method" id="how-it-works">
      <div className="premium-section-heading"><span className="premium-section-note">A little progress, every day</span><h2>From “I’m not sure”<br />to “I understand.”</h2><p>You don’t need to learn everything at once. Find your rhythm with focused practice and clear feedback.</p></div>
      <div className="premium-method-grid">
        <article><span className="premium-step">1 / Learn</span><BookOpen size={27} strokeWidth={1.5} /><h3>Make sense of the rules.</h3><p>Build your understanding of traffic rules and road signs before putting your knowledge to the test.</p></article>
        <article><span className="premium-step">2 / Practice</span><Check size={27} strokeWidth={1.5} /><h3>Learn from every answer.</h3><p>Take it question by question. Review your answers and spend time on what needs a little more attention.</p></article>
        <article><span className="premium-step">3 / Prepare</span><Timer size={27} strokeWidth={1.5} /><h3>Get familiar with the format.</h3><p>Bring your preparation together in a timed mock test, before the day of your real examination.</p></article>
      </div>
    </section>
    <section className="premium-about" id="about"><div className="container premium-about-grid"><div><span className="premium-section-note">Made for your next step</span><h2>Less guesswork.<br />More understanding.</h2><p>Igira brings practice, road signs and mock tests into one focused learning experience. Open it in your browser and pick up where your preparation begins.</p><a href={APP_ORIGIN} className="button button-yellow">Explore the application <ArrowUpRight size={18} /></a></div><div className="premium-language-panel"><span>Choose what feels clear.</span><p>English</p><p>Français</p><p>Kinyarwanda</p><small>Three languages. One learning journey.</small></div></div></section>
    <BlogPreview />
    <section className="container premium-partnership" id="advertise"><div><span className="premium-section-note">Grow with Igira</span><h2>Better learning.<br />Meaningful partnerships.</h2><p>Support accessible driving education or explore a relevant place for your brand.</p></div><a href="/sponsors" className="button button-navy">Explore partnerships <ArrowUpRight size={18} /></a></section>
    <section className="premium-final"><div className="container"><p>Your next step starts with understanding.</p><h2>Ready when you are.</h2><a href={APP_ORIGIN} className="button button-yellow">Start learning <ArrowUpRight size={18} /></a><span>Practice is preparation, not a guarantee of an examination result.</span></div></section>
    <Footer />
  </main>
}
