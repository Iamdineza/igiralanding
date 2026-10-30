'use client'

import { useState } from 'react'
import { ArrowRight, ChevronDown, ExternalLink } from 'lucide-react'
import type { Sponsor, SponsorTier } from '@/lib/sponsor-data'
import { commercialSponsors, sponsorshipTiers, technologySponsors } from '@/lib/sponsor-data'

export function SponsorLogo({ sponsor, size = 'default' }: { sponsor: Sponsor; size?: 'default' | 'large' }) {
  return sponsor.logo ? <img className={`sponsor-logo sponsor-logo-${size}`} src={sponsor.logo} alt={`${sponsor.name} official logo`} loading="lazy" /> : <span className="sponsor-name-placeholder">{sponsor.name}</span>
}

export function SponsorBadgePlaceholder({ tier, label = 'Reserved badge artwork' }: { tier: SponsorTier; label?: string }) {
  return <div className={`sponsor-badge-placeholder badge-${tier}`} aria-label={`${tier} Sponsor badge placeholder`}><span>{tier.toUpperCase()}</span><small>{label}</small></div>
}

export function SponsorShowcase({ sponsor, designation }: { sponsor: Sponsor; designation?: string }) {
  return <article className={`sponsor-showcase showcase-${sponsor.tier ?? 'institutional'}`}><div className="showcase-logo-area"><SponsorLogo sponsor={sponsor} size="large" /></div><div className="showcase-information"><span className="sponsor-badge">{designation ?? `${sponsor.tier?.toUpperCase()} SPONSOR`}</span><h3>{sponsor.name}</h3><p>{sponsor.description}</p>{sponsor.contribution && <p className="sponsor-contribution">{sponsor.contribution}</p>}{sponsor.website && <a className="text-link" href={sponsor.website} target="_blank" rel="noreferrer">Visit website <ExternalLink size={15} /></a>}</div><div className="showcase-badge-area"><SponsorBadgePlaceholder tier={sponsor.tier ?? 'bronze'} /></div></article>
}

export function TechnologySponsorShowcase({ sponsor }: { sponsor: Sponsor }) {
  return <SponsorShowcase sponsor={sponsor} designation="TECHNOLOGY SPONSOR" />
}

export function SponsorshipTiers() {
  return <div className="tier-grid">{sponsorshipTiers.map((tier) => { const sponsor = commercialSponsors.find((item) => item.tier === tier.id); return <article className={`tier-card tier-${tier.id}`} key={tier.id}><div className="tier-card-heading"><span className="tier-label">{tier.label} tier</span></div>{sponsor ? <><SponsorLogo sponsor={sponsor} /><h3>{sponsor.name}</h3><p>{sponsor.description}</p></> : <><h3>{tier.label} partnership</h3><p>{tier.description}</p></>}<a href="#inquiry" className="text-link">Request sponsorship details <ArrowRight size={15} /></a></article> })}</div>
}

export function InquiryForm() {
  return <form className="inquiry-form" id="inquiry" data-integration-point="partnership-inquiry"><div className="form-grid"><label>Organization name<input name="organization" required /></label><label>Contact person<input name="contact" required /></label><label>Business email<input name="email" type="email" required /></label><label>Phone number<input name="phone" type="tel" required /></label><label className="form-full">Partnership interest<select name="interest" required defaultValue=""><option value="" disabled>Select an option</option><option>Diamond Sponsorship</option><option>Platinum Sponsorship</option><option>Gold Sponsorship</option><option>Silver Sponsorship</option><option>Bronze Sponsorship</option><option>Technology Sponsorship</option><option>Institutional Partnership</option><option>Advertising</option><option>Other Collaboration</option></select></label><label>Estimated sponsorship budget <span className="optional-label">Optional</span><input name="budget" inputMode="decimal" /></label><label className="form-full">Message<textarea name="message" rows={5} required /></label></div><p className="form-note">We&apos;ll use these details only to respond to your partnership inquiry. Connect this form to your email or CRM endpoint before accepting submissions.</p><button className="button button-yellow" type="submit">Send inquiry <ArrowRight size={16} /></button></form>
}

export function SponsorWall() {
  const mainSponsors = technologySponsors.filter((sponsor) => sponsor.tier === 'diamond')
  const bigSponsors = technologySponsors.filter((sponsor) => sponsor.tier !== 'diamond')
  return <section className="sponsor-wall"><div className="container"><div className="sponsor-wall-heading"><span className="pill">OUR SPONSORS</span><h2>Igira is growing because of our sponsors.</h2><p>Partners who believe clearer driving education can help build safer roads across Rwanda.</p></div><div className="sponsor-wall-group"><span className="wall-label">MAIN SPONSORS</span><div className="main-sponsor-grid">{mainSponsors.map((sponsor) => <a className="main-sponsor" key={sponsor.id} href={sponsor.website} target="_blank" rel="noreferrer"><SponsorLogo sponsor={sponsor} size="large" /><strong>{sponsor.name}</strong><small>{sponsor.contribution}</small></a>)}</div></div><div className="sponsor-wall-group"><span className="wall-label">BIG SPONSORS</span><div className="big-sponsor-grid">{bigSponsors.length ? bigSponsors.map((sponsor) => <SponsorShowcase key={sponsor.id} sponsor={sponsor} />) : <div className="wall-placeholder">More sponsor places are open for organizations ready to support accessible driving education.</div>}</div></div><div className="sponsor-wall-group"><span className="wall-label">SMALL SPONSORS</span><div className="small-sponsor-grid">{['Community partners','Road safety supporters','Education allies','Local businesses','Mobility partners','Future sponsors','Training partners','Digital supporters','Public-interest partners','Driving schools'].map((label) => <span key={label}>{label}</span>)}</div></div></div></section>
}

export function SponsorFAQ() {
  const [open, setOpen] = useState<number | null>(0)
  const items = [['What sponsorship opportunities are available?', 'Diamond, Platinum, Gold, Silver and Bronze sponsorship tiers are available, alongside technology and institutional partnerships.'], ['How are sponsorship tiers determined?', 'Tier recognition is shaped by the scope of support, visibility and collaboration agreed together. We do not publish fixed prices yet.'], ['Can organizations contribute technology or services instead of money?', 'Yes. Technology, infrastructure and professional services can be explored as part of a partnership conversation.'], ['Can a sponsor also advertise on Igira?', 'Yes. Advertising is handled as a separate opportunity and does not automatically grant sponsorship status.'], ['Can public institutions become partners?', 'Yes. Institutional partnerships are considered separately and only confirmed relationships are displayed as partners.'], ['How can an organization submit a partnership proposal?', 'Complete the inquiry form on this page with your organization and partnership details.']]
  return <div className="sponsor-faq-list">{items.map(([question, answer], index) => <div className={`sponsor-faq-item ${open === index ? 'open' : ''}`} key={question}><button type="button" onClick={() => setOpen(open === index ? null : index)} aria-expanded={open === index}>{question}<ChevronDown size={18} /></button>{open === index && <p>{answer}</p>}</div>)}</div>
}
