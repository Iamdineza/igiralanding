'use client'

import { useState } from 'react'
import { ArrowRight, ChevronDown, ExternalLink } from 'lucide-react'
import { commercialSponsors, sponsorshipTiers, technologySponsors } from '@/lib/sponsor-data'

export function SponsorLogo({ sponsor, size = 'default' }: { sponsor: (typeof technologySponsors)[number]; size?: 'default' | 'large' }) {
  return sponsor.logo ? <img className={`sponsor-logo sponsor-logo-${size}`} src={sponsor.logo} alt={`${sponsor.name} logo`} /> : <span className="sponsor-name-placeholder">{sponsor.name}</span>
}

export function TechnologySponsorCard({ sponsor }: { sponsor: (typeof technologySponsors)[number] }) {
  return <article className="technology-sponsor-card"><div className="sponsor-card-top"><span className="sponsor-badge sponsor-badge-technology">TECHNOLOGY SPONSOR</span><SponsorLogo sponsor={sponsor} size="large" /></div><p className="sponsor-contribution">{sponsor.contribution}</p><p>{sponsor.description}</p>{sponsor.website && <a className="text-link" href={sponsor.website} target="_blank" rel="noreferrer">Visit website <ExternalLink size={15} /></a>}</article>
}

export function CommercialTierGrid() {
  return <div className="tier-grid">{sponsorshipTiers.map((tier) => { const sponsor = commercialSponsors.find((item) => item.tier === tier.id); return <article className={`tier-card tier-${tier.id}`} key={tier.id}><div className="tier-card-heading"><span className="tier-badge-placeholder">{tier.label.toUpperCase()}</span><span className="tier-label">{sponsor ? sponsor.name : 'Open opportunity'}</span></div>{sponsor ? <><SponsorLogo sponsor={sponsor} /><p>{sponsor.description}</p></> : <><h3>Become our next {tier.label} Sponsor</h3><p>{tier.description}</p></>}<a href="#inquiry" className="text-link">Request details <ArrowRight size={15} /></a></article> })}</div>
}

export function InquiryForm() {
  const [message, setMessage] = useState('')
  return <form className="inquiry-form" id="inquiry" onSubmit={(event) => { event.preventDefault(); setMessage('Thanks for your interest. The inquiry form is ready to connect to your preferred email or CRM endpoint.') }}><div className="form-grid"><label>Organization name<input name="organization" required /></label><label>Contact person<input name="contact" required /></label><label>Business email<input name="email" type="email" required /></label><label>Phone number<input name="phone" type="tel" required /></label><label className="form-full">Partnership interest<select name="interest" required defaultValue=""><option value="" disabled>Select an option</option><option>Technology Sponsorship</option><option>Diamond Sponsorship</option><option>Platinum Sponsorship</option><option>Gold Sponsorship</option><option>Silver Sponsorship</option><option>Bronze Sponsorship</option><option>Institutional Partnership</option><option>Advertising Partnership</option><option>Other Collaboration</option></select></label><label className="form-full">Message<textarea name="message" rows={5} required /></label></div><button className="button button-yellow" type="submit">Send inquiry <ArrowRight size={16} /></button>{message && <p className="form-note" role="status">{message}</p>}</form>
}

export function SponsorFAQ() {
  const [open, setOpen] = useState<number | null>(0)
  const items = [['Do sponsorships include fixed public prices?', 'No. We keep sponsorship values and benefits configurable so we can shape the right partnership together.'], ['Can one organization have multiple classifications?', 'Yes. A sponsor can be recognized as both a technology sponsor and a commercial tier sponsor.'], ['How can we advertise without sponsoring?', 'Advertising is handled separately through campaign and placement proposals and does not automatically assign a sponsorship tier.'], ['Can institutions become partners?', 'Yes. Institutional partnerships are reviewed and only confirmed partners are shown publicly.']]
  return <div className="sponsor-faq-list">{items.map(([question, answer], index) => <div className={`sponsor-faq-item ${open === index ? 'open' : ''}`} key={question}><button type="button" onClick={() => setOpen(open === index ? null : index)} aria-expanded={open === index}>{question}<ChevronDown size={18} /></button>{open === index && <p>{answer}</p>}</div>)}</div>
}
