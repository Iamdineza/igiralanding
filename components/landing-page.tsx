'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight, ChevronDown, Menu, Search, X } from 'lucide-react'
import { assetLabel, deviceFrames, landingPageAssets, type AssetKey, type FrameKey } from '@/lib/landing-assets'

function Logo() {
  return <a href="#top" className="logo-wrap" aria-label="Igira Provisoire home"><img src={landingPageAssets.logo.src} alt={landingPageAssets.logo.alt} /></a>
}

function ImagePlaceholder({ asset, className = '' }: { asset: AssetKey; className?: string }) {
  const item = landingPageAssets[asset]
  return item.src ? <img src={item.src} alt={item.alt} className={className} loading="lazy" /> : <div className={`image-placeholder ${className}`} role="img" aria-label={`${assetLabel(asset)} image placeholder`}><span>IMAGE PLACEHOLDER</span><strong>{assetLabel(asset)}</strong></div>
}

function DeviceMockup({ frame, screenshot, className = '' }: { frame: FrameKey; screenshot: AssetKey; className?: string }) {
  const shot = landingPageAssets[screenshot]
  const device = deviceFrames[frame]
  return <div className={`device-mockup ${className}`}>
    <div className="device-screen">{shot.src ? <img src={shot.src} alt={shot.alt} loading="lazy" /> : <div className="screen-placeholder"><span>SCREENSHOT</span><b>{assetLabel(screenshot)}</b></div>}</div>
    {device.src ? <img className="device-frame" src={device.src} alt={device.alt} /> : <div className="device-frame-placeholder" aria-label={`${assetLabel(frame)} device frame placeholder`}><span>DEVICE FRAME PLACEHOLDER</span><b>{assetLabel(frame)}</b></div>}
  </div>
}

function HighlightUnderline({ children }: { children: React.ReactNode }) { return <span className="highlight-underline">{children}</span> }
function SouthingAccent({ children }: { children: React.ReactNode }) { return <span className="southing">{children}</span> }
function Pill({ children }: { children: React.ReactNode }) { return <span className="pill">{children}</span> }
function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { once: true, margin: '-80px' })
  return <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 26 }} animate={visible ? { opacity: 1, y: 0 } : undefined} transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
}

function AnimatedCounter({ value, label }: { value: string; label: string }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { once: true, margin: '-80px' })
  const numeric = Number.parseInt(value.replace(/\D/g, ''), 10)
  const progress = useMotionValue(0)
  const spring = useSpring(progress, { stiffness: 90, damping: 20 })
  const [display, setDisplay] = useState('0')
  useEffect(() => { if (visible && numeric) progress.set(numeric) }, [visible, numeric, progress])
  useEffect(() => spring.on('change', (latest) => setDisplay(value.includes('/') ? `${Math.round(latest)}/20` : value.includes('min') ? `${Math.round(latest)} min` : value === '3' ? `${Math.round(latest)}` : value)), [spring, value])
  return <div ref={ref} className="stat"><strong>{numeric ? display : value}</strong><span>{label}</span></div>
}

const navItems = [['About', '#about'], ['How It Works', '#how-it-works'], ['Blog', '/blog'], ['For Driving Schools', '#schools'], ['Advertise With Us', '#advertise']]
const languages = [['EN', '🇬🇧', 'English'], ['FR', '🇫🇷', 'Français'], ['RW', '🇷🇼', 'Kinyarwanda']] as const

function LanguageSelector({ mobile = false }: { mobile?: boolean }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(languages[0])
  return <div className={`language-select ${mobile ? 'language-select-mobile' : ''}`}>
    <button className="language" onClick={() => setOpen((value) => !value)} aria-haspopup="listbox" aria-expanded={open}>
      <span aria-hidden="true">{selected[1]}</span> {selected[0]} <ChevronDown size={13} />
    </button>
    {open && <div className="language-menu" role="listbox" aria-label="Choose language">{languages.map((language) => <button key={language[0]} role="option" aria-selected={selected[0] === language[0]} onClick={() => { setSelected(language); setOpen(false) }}><span aria-hidden="true">{language[1]}</span><span>{language[2]}</span><b>{language[0]}</b></button>)}</div>}
  </div>
}
const faqs = [
  ['What is Igira Provisoire?', 'A digital learning platform that helps people prepare for Rwanda’s driving theory test with clear, practical lessons and timed practice.'],
  ['Is Igira Provisoire free?', 'You can get started and explore the preparation experience directly from the platform.'],
  ['Which languages are supported?', 'English, Français and Kinyarwanda.'],
  ['Can I use Igira on my phone?', 'Yes. The web experience is designed to work beautifully on mobile, with dedicated mobile apps coming soon.'],
  ['How does the mock test work?', 'You answer 20 questions in 20 minutes and need 12/20 to pass the practice test.'],
  ['What is the passing score?', 'The mock test passing score is 12 out of 20.'],
  ['Are mobile apps available?', 'Android and iOS apps are coming soon.'],
  ['Can driving schools use Igira?', 'Yes. We are expanding into licensed, customizable software for driving schools.'],
  ['Can the driving school software be customized?', 'Yes. Schools will be able to configure branding, modules and workflows.'],
  ['How can I advertise with Igira?', 'Reach out through Advertise With Us to explore relevant mobility and road-safety partnerships.'],
]

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false); const [open, setOpen] = useState(false)
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 40); window.addEventListener('scroll', onScroll); return () => window.removeEventListener('scroll', onScroll) }, [])
  return <header className={`site-nav ${scrolled ? 'scrolled' : ''}`}><div className="nav-pill"><Logo /><nav className="desktop-nav">{navItems.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</nav><div className="nav-actions"><LanguageSelector /><a className="button button-yellow nav-cta" href="https://www.igiraprovisoire.rw">Get Started <ArrowRight size={16} /></a><button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'}>{open ? <X /> : <Menu />}</button></div></div>{open && <div className="mobile-menu">{navItems.map(([label, href]) => <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>)}<LanguageSelector mobile /><a className="button button-yellow" href="https://www.igiraprovisoire.rw">Get Started <ArrowRight size={16} /></a></div>}</header>
}

function StatsSection() { const stats = [['3', 'Languages'], ['20 min', 'Mock Test'], ['12/20', 'Passing Score'], ['24/7', 'Online Access']] as const; return <section className="stats-section"><div className="container stats-grid">{stats.map(([value, label]) => <AnimatedCounter value={value} label={label} key={label} />)}</div></section> }

function HeroSection() { return <section className="hero" id="top"><div className="road-lines" aria-hidden="true" /><div className="container hero-grid"><Reveal className="hero-copy"><Pill>BUILT FOR RWANDA</Pill><h1>Prepare for the road with <SouthingAccent><HighlightUnderline>confidence.</HighlightUnderline></SouthingAccent></h1><p>Prepare for Rwanda&apos;s driving theory test with practice questions, mock tests and practical driving knowledge in English, French and Kinyarwanda.</p><div className="hero-actions"><a className="button button-yellow" href="https://www.igiraprovisoire.rw">Get Started <ArrowRight size={17} /></a><a className="text-link" href="#blog">Explore the Blog <ArrowRight size={16} /></a></div><div className="hero-trust"><span className="trust-dot" /> A clearer way to prepare</div></Reveal><Reveal className="hero-visual"><div className="hero-desktop"><DeviceMockup frame="heroDesktopFrame" screenshot="heroDesktopScreenshot" /></div><div className="hero-mobile"><DeviceMockup frame="heroMobileFrame" screenshot="heroMobileScreenshot" /></div><div className="float-badge badge-one"><b>12/20</b><span>Passing Score</span></div><div className="float-badge badge-two"><b>20 min</b><span>Mock Test</span></div><div className="float-badge badge-three"><b>3</b><span>Languages</span></div></Reveal></div></section> }

function HowItWorks() { const steps = [['01', 'Learn', 'Understand traffic rules, road signs and driving concepts.'], ['02', 'Practice', 'Test your knowledge using practice questions.'], ['03', 'Prepare', 'Take timed mock tests and prepare for the theory test.']]; return <section className="section how-section" id="how-it-works"><div className="container"><Reveal className="section-heading"><Pill>THE METHOD</Pill><h2>Your preparation <SouthingAccent>starts here.</SouthingAccent></h2><p>A simple, focused path from uncertainty to confidence on the road.</p></Reveal><div className="steps-grid">{steps.map(([num, title, copy]) => <Reveal className="step" key={num}><span className="step-number">{num}</span><h3>{title}</h3><p>{copy}</p></Reveal>)}</div><ImagePlaceholder asset="howItWorksVisual" className="wide-placeholder" /></div></section> }

function ProductShowcase() { return <section className="section product-section" id="about"><div className="container"><Reveal className="section-heading"><Pill>THE PRODUCT</Pill><h2>Study smarter. <SouthingAccent>Drive ready.</SouthingAccent></h2><p>Everything you need to turn theory into instincts, without the pressure.</p></Reveal><div className="feature-row"><div className="feature-copy"><span className="eyebrow">PRACTICE MODE</span><h3>Practice without the pressure.</h3><p>Build your understanding one question at a time. Learn from your answers and make progress you can feel.</p><a className="text-link" href="https://www.igiraprovisoire.rw">Get Started <ArrowRight size={16} /></a></div><DeviceMockup frame="practiceDesktopFrame" screenshot="practiceDesktopScreenshot" className="showcase-device" /></div><div className="feature-row reverse"><div className="feature-copy"><span className="eyebrow">MOBILE FIRST</span><h3>Prepare wherever you are.</h3><p>Turn a commute, a break or a quiet evening into meaningful preparation. Your progress goes where you go.</p><div className="language-row"><Pill>English</Pill><Pill>Français</Pill><Pill>Kinyarwanda</Pill></div></div><DeviceMockup frame="practiceMobileFrame" screenshot="practiceMobileScreenshot" className="showcase-device phone" /></div><div className="feature-row"><div className="feature-copy"><span className="eyebrow">MOCK TEST</span><h3>Test yourself before the real test.</h3><p>20 questions. 20 minutes. A 12/20 passing score. Practice the pace and build confidence before exam day.</p><div className="metric-line"><b>20</b><span>questions</span><b>20</b><span>minutes</span><b>12/20</b><span>to pass</span></div></div><DeviceMockup frame="mockTestDesktopFrame" screenshot="mockTestDesktopScreenshot" className="showcase-device" /></div></div></section> }

function LanguageSection() { return <section className="language-section"><div className="container language-layout"><Reveal><Pill>MADE TO MEET YOU</Pill><h2>Learn in the language that <SouthingAccent>works for you.</SouthingAccent></h2><p>Clarity matters when you&apos;re learning the rules of the road. Choose the language that makes every concept click.</p></Reveal><Reveal className="language-display"><span>English</span><span>Français</span><span className="active-language">Kinyarwanda</span></Reveal></div></section> }

const articles = [['Featured', 'Understanding Right of Way in Rwanda', 'blogFeatured', 'right-of-way-rwanda'], ['Traffic Rules', 'The road rules every learner should know', 'blogTrafficRules', 'traffic-rules-every-learner'], ['Road Signs', 'Understanding warning road signs', 'blogRoadSigns', 'warning-road-signs'], ['Driving Guide', 'How to prepare for your driving theory test', 'blogDrivingGuide', 'prepare-driving-theory-test']] as const
function BlogPreview() { const [filter, setFilter] = useState('All'); const filters = ['All', 'Traffic Rules', 'Road Signs', 'Driving Guide']; const filtered = filter === 'All' ? articles : articles.filter(([category]) => category === filter); return <section className="section blog-section" id="blog"><div className="container"><Reveal className="section-heading row-heading"><div><Pill>KNOWLEDGE HUB</Pill><h2>Learn beyond the <SouthingAccent>test.</SouthingAccent></h2></div><a className="text-link desktop-only" href="/blog">Explore All Articles <ArrowRight size={16} /></a></Reveal><div className="blog-toolbar"><div className="filter-list">{filters.map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div><div className="search-box"><Search size={16} /><span>Search articles</span></div></div><div className="articles-grid">{filtered.map(([category, title, image, slug]) => <Reveal className={`article-card ${category === 'Featured' ? 'featured' : ''}`} key={title}><ImagePlaceholder asset={image} /><div className="article-meta"><span>{category}</span><span>5 min read</span></div><h3>{title}</h3><a href={`/blog/${slug}`} aria-label={`Read ${title}`}>Read article <ArrowRight size={15} /></a></Reveal>)}</div></div></section> }

function MobileAppsSection() { return <section className="section apps-section"><div className="container apps-layout"><Reveal><Pill>COMING SOON</Pill><h2>Your preparation, <SouthingAccent>wherever you go.</SouthingAccent></h2><p>Dedicated Android and iOS experiences are on the way. Get the same focused preparation, designed for your pocket.</p><div className="app-labels"><span>Android</span><span>iOS</span></div></Reveal><div className="app-devices"><DeviceMockup frame="androidDeviceFrame" screenshot="androidAppScreenshot" className="app-phone android" /><DeviceMockup frame="iosDeviceFrame" screenshot="iosAppScreenshot" className="app-phone ios" /></div></div></section> }

function DrivingSchoolSection() { return <><section className="section school-section" id="schools"><div className="container school-layout"><Reveal><Pill>FOR DRIVING SCHOOLS</Pill><h2>Built for learners. <SouthingAccent>Ready for schools.</SouthingAccent></h2><p>Igira Provisoire is expanding into licensed and customizable software for driving schools — helping teams manage the journey from first lesson to licence.</p><ul className="check-list"><li>Student management</li><li>Instructor management</li><li>Lesson scheduling</li><li>Attendance and reports</li><li>Payments and school branding</li><li>Custom workflows and modules</li></ul><Pill>COMING SOON</Pill></Reveal><DeviceMockup frame="schoolDesktopFrame" screenshot="schoolDashboardScreenshot" className="school-device" /></div></section><section className="section customization-section"><div className="container customization-layout"><DeviceMockup frame="schoolDesktopFrame" screenshot="schoolCustomizationScreenshot" className="school-device" /><Reveal><Pill>COMING SOON</Pill><h2>Your school. Your workflow. <SouthingAccent>Your platform.</SouthingAccent></h2><p>Every driving school works differently. Configure branding, modules, workflows and dashboards around the way your team actually operates.</p><div className="mini-list"><span>Custom branding</span><span>Configurable workflows</span><span>Licensed deployments</span></div></Reveal></div></section></> }

function AdvertiseSection() { return <section className="advertise-section" id="advertise"><div className="container advertise-layout"><Reveal><Pill>PARTNER WITH IGIRA</Pill><h2>Reach people preparing for the road.</h2><p>Put your brand in front of a focused, growing audience of learners and future drivers in Rwanda.</p><a className="button button-yellow" href="mailto:hello@igiraprovisoire.rw">Advertise With Us <ArrowRight size={17} /></a></Reveal><ImagePlaceholder asset="advertisingVisual" className="advertising-placeholder" /></div></section> }

function WhyIgira() { const points = [['01', 'Built for Rwanda', 'Local context, practical knowledge and a platform made for the roads we share.'], ['02', 'Multilingual', 'Learn in English, Français or Kinyarwanda — without losing meaning in translation.'], ['03', "Learn, don't memorize", 'Understand why the rules matter, so the knowledge stays with you.'], ['04', 'Always accessible', 'A focused preparation experience available whenever you are ready to learn.']]; return <section className="section why-section"><div className="container"><Reveal className="section-heading"><Pill>WHY IGIRA</Pill><h2>Confidence is built <SouthingAccent>before</SouthingAccent> the road.</h2></Reveal><div className="why-grid">{points.map(([num, title, copy]) => <Reveal className="why-item" key={num}><span>{num}</span><h3>{title}</h3><p>{copy}</p></Reveal>)}</div></div></section> }

function FAQSection() { const [open, setOpen] = useState<number | null>(0); return <section className="section faq-section"><div className="container faq-layout"><Reveal className="faq-intro"><Pill>QUESTIONS, ANSWERED</Pill><h2>Good to know before you <SouthingAccent>go.</SouthingAccent></h2><p>Still curious? Start your preparation and discover the experience for yourself.</p><a className="button button-navy" href="https://www.igiraprovisoire.rw">Get Started <ArrowRight size={17} /></a></Reveal><div className="faq-list">{faqs.map(([question, answer], index) => <div className={`faq-item ${open === index ? 'open' : ''}`} key={question}><button onClick={() => setOpen(open === index ? null : index)} aria-expanded={open === index}><span>{question}</span><ChevronDown size={18} /></button><AnimatePresence initial={false}>{open === index && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.24 }}><span>{answer}</span></motion.p>}</AnimatePresence></div>)}</div></div></section> }

function FinalCTA() { return <section className="final-cta"><div className="container"><Pill>YOUR NEXT MOVE</Pill><h2>Ready to prepare for the <SouthingAccent>road?</SouthingAccent></h2><p>Learn the rules. Practice your knowledge. Prepare with confidence.</p><a className="button button-yellow" href="https://www.igiraprovisoire.rw">Get Started <ArrowRight size={17} /></a></div></section> }

function Footer() { return <footer className="footer"><div className="container footer-top"><div className="footer-brand"><Logo /><p>Modern driving theory preparation, built for Rwanda.</p></div><div><h4>Explore</h4><a href="#about">About</a><a href="#how-it-works">How It Works</a><a href="#blog">Blog</a><a href="https://www.igiraprovisoire.rw">Get Started</a></div><div><h4>Learn</h4><a href="/blog?category=Traffic%20Rules">Traffic Rules</a><a href="/blog?category=Road%20Signs">Road Signs</a><a href="/blog?category=Driving%20Guide">Driving Guide</a></div><div><h4>For Business</h4><a href="#schools">Driving Schools</a><a href="#advertise">Advertise With Us</a></div></div><div className="container footer-bottom"><span>© 2026 Igira Provisoire</span><div><a href="#">Privacy Policy</a><a href="#">Terms of Use</a></div><span>Made for the road ahead.</span></div></footer> }

export default function LandingPage() { return <main><LandingNavbar /><HeroSection /><StatsSection /><HowItWorks /><ProductShowcase /><LanguageSection /><BlogPreview /><MobileAppsSection /><DrivingSchoolSection /><AdvertiseSection /><WhyIgira /><FAQSection /><FinalCTA /><Footer /></main> }
