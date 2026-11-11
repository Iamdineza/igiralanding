'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, BookOpen, Check, ChevronDown, Globe2, Newspaper, Search, Timer, TrafficCone } from 'lucide-react'
import BrandNavbar from '@/components/brand-navbar'
import { Footer } from '@/components/landing-page'
import { APP_ORIGIN } from '@/lib/site-config'
import { blogArticles, blogCategories } from '@/lib/blog-data'
import { landingPageAssets } from '@/lib/landing-assets'

const modes = [
  { name: 'Practice questions', icon: BookOpen, title: 'Learn at your own pace.', description: 'Work through questions, review your answers and build your understanding of the rules. Take your time with the topics that need a little more attention.', image: '/screens-desktop-practice.png', action: 'Open practice', path: '/practice', points: ['Question-by-question preparation', 'Answer feedback and explanations', 'Road signs and traffic rules'] },
  { name: 'Mock examinations', icon: Timer, title: 'Prepare for the examination experience.', description: 'Bring your knowledge together in a timed mock test. Get familiar with the format and review your results before your real theory examination.', image: '/screens-test-desktop.png', action: 'Explore mock tests', path: '/test', points: ['Timed examination practice', 'A focused testing experience', 'Results to guide your preparation'] },
  { name: 'Practice on mobile', icon: Globe2, title: 'Make learning part of your day.', description: 'Open Igira in your mobile browser and fit a little preparation around your day. The same learning journey, on the screen you have with you.', image: '/screens-practice-mobile.png', action: 'Start learning', path: '', points: ['Works in your browser', 'No app download required', 'Choose your learning language'] },
] as const
const languages = [
  { label: 'English', title: 'Understand the rules. Prepare with confidence.', note: 'Practice, road signs and mock tests in English.' },
  { label: 'Français', title: 'Comprenez les règles. Préparez-vous avec confiance.', note: 'Entraînement, panneaux et examens blancs en français.' },
  { label: 'Kinyarwanda', title: 'Itegure ikizamini cy’amategeko y’umuhanda.', note: 'Wige amategeko n’ibimenyetso byo mu muhanda mu Kinyarwanda.' },
] as const
const questions = [
  ['How do I start learning?', 'Open the Igira application using Start learning, choose your language and follow the sign-in or visitor registration steps. You can then choose practice or a mock test.'],
  ['Can I use Igira on my phone?', 'Yes. You can use the web application in a mobile browser, as well as on a laptop or desktop. No app-store download is needed to use the website.'],
  ['Which languages are available?', 'The application supports English, French and Kinyarwanda. Choose your preferred learning language inside the application.'],
  ['Does a mock-test result guarantee that I will pass?', 'No. Igira is a preparation tool. Practice results do not guarantee an official examination result or replace the requirements of the examination authority.'],
] as const

export default function BrandLandingPage() {
  const reducedMotion = useReducedMotion()
  const [mode, setMode] = useState(0)
  const [language, setLanguage] = useState(0)
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [faq, setFaq] = useState<number | null>(0)
  const selected = modes[mode]
  const articles = blogArticles.filter(article => (category === 'All' || article.category === category) && article.title.toLowerCase().includes(search.trim().toLowerCase()))
  return <main className="igira-brand-page" id="top">
    <BrandNavbar />

    <section className="brand-hero">
      <img className="brand-hero-landscape" src="/blog-rwanda-roads.png" alt="" width={1024} height={1024} fetchPriority="high" />
      <div className="brand-container brand-hero-grid"><div className="brand-hero-copy">
        <span className="brand-hero-label"><span /> Made for the road ahead</span>
        <h1>Your journey to<br />the road starts here.</h1>
        <p>Prepare for Rwanda’s driving theory test with practice questions, mock examinations and clear explanations—in the language that works for you.</p>
        <div className="brand-hero-actions"><a className="brand-button brand-button-yellow" href={APP_ORIGIN}>Start learning <ArrowUpRight size={19} /></a><a className="brand-button brand-button-glass" href="#learning">Discover Igira <ArrowRight size={18} /></a></div>
        <div className="brand-hero-languages"><Globe2 size={18} /><span>English</span><i /><span>Français</span><i /><span>Kinyarwanda</span></div>
        <a className="brand-hero-sokrab" href="https://sokrab.com/home" target="_blank" rel="noopener noreferrer"><span>Hosting supported by</span><img src="/sokrab-logo-black.png" alt="Sokrab Group" width={130} height={40} /><ArrowUpRight size={15} /></a>
      </div><motion.div className="brand-hero-product" initial={reducedMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : .6, delay: .12 }}><div className="brand-device-label"><span /> Your practice. Your pace.</div><img src="/screens-hero-mobile.png" alt="Igira Provisoire learning experience on a phone" width={430} height={760} /><div className="brand-device-caption"><BookOpen size={18} /><span>A little practice.<br /><strong>A clearer understanding.</strong></span></div></motion.div></div>
    </section>

    <div className="brand-container brand-pathways" aria-label="Choose your next step">{[
      { icon: BookOpen, title: 'Practice questions', text: 'Build your understanding', href: `${APP_ORIGIN}/practice` },
      { icon: Timer, title: 'Mock examinations', text: 'Prepare for the format', href: `${APP_ORIGIN}/test` },
      { icon: TrafficCone, title: 'Road signs', text: 'Recognise what matters', href: `${APP_ORIGIN}/practice` },
      { icon: Newspaper, title: 'Learning articles', text: 'Explore the knowledge hub', href: '/blog' },
    ].map(item => <a href={item.href} key={item.title}><item.icon size={25} strokeWidth={1.6} /><div><strong>{item.title}</strong><span>{item.text}</span></div><ArrowUpRight size={19} /></a>)}</div>

    <section className="brand-about brand-section" id="about"><div className="brand-container brand-about-grid"><div><span className="brand-kicker">Discover Igira Provisoire</span><h2>More understanding.<br />Less uncertainty.</h2></div><div><p>Learning the rules is about more than remembering the right answer. It’s about understanding the choices you’ll make on the road.</p><p>Igira brings practice, road signs and mock examinations into one place—so you can prepare step by step, on your phone or computer.</p><a href="#learning" className="brand-text-link">Find your way to learn <ArrowRight size={18} /></a></div></div></section>

    <section className="brand-learning brand-section" id="how-it-works"><div className="brand-container" id="learning"><div className="brand-section-heading"><span className="brand-kicker">One platform. Different ways to prepare.</span><h2>Learning that fits your journey.</h2><p>Start with a question. Build your knowledge. Put it into practice.</p></div>
      <div className="brand-mode-tabs" role="group" aria-label="Choose a learning preview">{modes.map((item, index) => <button key={item.name} type="button" aria-pressed={mode === index} onClick={() => setMode(index)}><item.icon size={20} />{item.name}<ArrowRight size={17} /></button>)}</div>
      <div className="brand-product-showcase"><div className="brand-product-copy"><span className="brand-product-number">{String(mode + 1).padStart(2, '0')} / {selected.name}</span><h3>{selected.title}</h3><p>{selected.description}</p><ul>{selected.points.map(point => <li key={point}><Check size={17} />{point}</li>)}</ul><a className="brand-button brand-button-navy" href={`${APP_ORIGIN}${selected.path}`}>{selected.action}<ArrowUpRight size={18} /></a></div><AnimatePresence initial={false} mode="wait"><motion.div key={mode} className={`brand-product-image ${mode === 2 ? 'is-mobile' : ''}`} initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : .2 }}><span>Inside the Igira application</span><img src={selected.image} alt={`Igira ${selected.name.toLowerCase()} product preview`} width={1440} height={900} loading="lazy" /></motion.div></AnimatePresence></div>
    </div></section>

    <section className="brand-language-section"><div className="brand-container brand-language-grid"><div><span className="brand-kicker">Clarity begins with language</span><h2>Learn in a language<br />that feels like yours.</h2><p>Choose English, French or Kinyarwanda inside the application. Spend your energy understanding the rules, not translating them.</p><a href={APP_ORIGIN} className="brand-text-link">Open the application <ArrowRight size={18} /></a></div><div className="brand-language-card"><div className="brand-language-options" role="group" aria-label="Preview a learning language">{languages.map((item, index) => <button key={item.label} type="button" aria-pressed={language === index} onClick={() => setLanguage(index)}>{item.label}</button>)}</div><div aria-live="polite"><Globe2 size={36} strokeWidth={1.3} /><h3>{languages[language].title}</h3><p>{languages[language].note}</p></div><span className="brand-language-footnote">Select your learning language in Igira when you get started.</span></div></div></section>

    <section className="brand-articles brand-section" id="blog"><div className="brand-container"><div className="brand-heading-row"><div><span className="brand-kicker">The knowledge hub</span><h2>A little knowledge<br />goes a long way.</h2></div><a href="/blog" className="brand-text-link">All articles <ArrowRight size={18} /></a></div><div className="brand-article-tools"><div role="group" aria-label="Article categories">{blogCategories.map(item => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="brand-search"><Search size={17} /><input type="search" aria-label="Search articles" placeholder="Search articles" value={search} maxLength={100} onChange={event => setSearch(event.target.value)} /></label></div><div className="brand-article-grid">{articles.map(article => <article key={article.slug}><a href={`/blog/${article.slug}`} className="brand-article-image" aria-label={`Read ${article.title}`}><img src={landingPageAssets[article.imageKey].src} alt={landingPageAssets[article.imageKey].alt} width={600} height={420} loading="lazy" /></a><div className="brand-article-meta"><span>{article.category}</span><span>{article.readTime}</span></div><h3><a href={`/blog/${article.slug}`}>{article.title}</a></h3><p>{article.excerpt}</p><a href={`/blog/${article.slug}`} className="brand-text-link">Read article <ArrowUpRight size={16} /></a></article>)}</div>{articles.length === 0 && <p className="brand-empty" role="status">No articles match your search. Try another word or category.</p>}</div></section>

    <section className="brand-schools brand-section" id="schools"><div className="brand-container brand-school-grid"><div><span className="brand-kicker">For driving schools</span><h2>Support your learners.<br />Start a conversation.</h2><p>Interested in using Igira with your learners? Tell us about your school and the preparation support you need. We can discuss the right next step together.</p><a className="brand-button brand-button-navy" href="/sponsors#inquiry">Discuss a school partnership <ArrowUpRight size={18} /></a></div><div className="brand-school-visual"><img src="/screens-school-dashboard.png" alt="Igira school dashboard preview" width={1200} height={800} loading="lazy" /><span>Explore a partnership for your school.</span></div></div></section>
    <section className="brand-sponsor" id="advertise"><div className="brand-container brand-sponsor-grid"><div className="brand-sponsor-identity"><span>Hosting supported by</span><a href="https://sokrab.com/home" target="_blank" rel="noopener noreferrer"><img src="/sokrab-logo-black.png" alt="Sokrab Group" width={230} height={80} /><ArrowUpRight size={20} /></a></div><div><h2>Supporting the road ahead.</h2><p>Sokrab Group supports the hosting behind Igira Provisoire. Interested in helping more learners access driving education?</p><a href="/sponsors" className="brand-text-link">Explore a partnership <ArrowRight size={18} /></a></div></div></section>

    <section className="brand-faq brand-section"><div className="brand-container brand-faq-grid"><div><span className="brand-kicker">Before you get started</span><h2>A few things<br />worth knowing.</h2><a href="mailto:info@igiraprovisoire.rw" className="brand-text-link">Ask us a question <ArrowUpRight size={18} /></a></div><div>{questions.map(([question, answer], index) => <div className="brand-faq-item" key={question}><button type="button" aria-expanded={faq === index} aria-controls={`brand-answer-${index}`} onClick={() => setFaq(faq === index ? null : index)}>{question}<ChevronDown size={19} /></button><AnimatePresence initial={false}>{faq === index && <motion.p key={index} id={`brand-answer-${index}`} initial={{ opacity: 0, height: reducedMotion ? 'auto' : 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: reducedMotion ? 'auto' : 0 }} transition={{ duration: reducedMotion ? 0 : .2 }}>{answer}</motion.p>}</AnimatePresence></div>)}</div></div></section>
    <section className="brand-final"><div className="brand-container"><div><span>Your next step starts here</span><h2>Prepare today.<br />Drive with understanding.</h2></div><a href={APP_ORIGIN} className="brand-button brand-button-navy">Start learning <ArrowUpRight size={19} /></a></div></section>
    <div className="brand-road-pattern" aria-hidden="true" /><Footer />
  </main>
}
