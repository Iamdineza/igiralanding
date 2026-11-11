'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { confirmedSponsors, sponsorshipTiers, type SponsorTier } from '@/lib/sponsor-data'

export default function SponsorPackages() {
  const [selected, setSelected] = useState<SponsorTier | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const tier = sponsorshipTiers.find(item => item.id === selected)
  const supporters = confirmedSponsors.filter(sponsor => sponsor.tier === selected)
  useEffect(() => {
    if (selected && !dialog.current?.open) dialog.current?.showModal()
  }, [selected])
  function close() { dialog.current?.close(); setSelected(null) }
  return <>
    <div className="partner-tiers">{sponsorshipTiers.map(item => <button type="button" key={item.id} className={`partner-tier partner-tier-${item.id}`} aria-haspopup="dialog" onClick={() => setSelected(item.id)}>
      <img className="partner-tier-badge" src={`/badges/${item.id}.svg`} alt="" width={112} height={112} loading="lazy" />
      <h3>{item.label}</h3><p>{item.description}</p><span className="package-open-label">View package & supporters</span>
    </button>)}</div>
    <dialog ref={dialog} className="package-dialog" aria-labelledby="package-dialog-title" aria-describedby="package-dialog-description" onClose={() => setSelected(null)} onClick={event => { if(event.target === event.currentTarget) close() }}>
      {tier && <><button className="package-dialog-close" type="button" aria-label="Close package details" onClick={close}><X size={22} /></button>
        <div className="package-dialog-grid"><div className="package-dialog-art"><img src={`/badges/${tier.id}.svg`} width={230} height={230} alt={`${tier.label} Igira sponsorship badge`} /><h2 id="package-dialog-title">{tier.label} sponsorship</h2><p id="package-dialog-description">{tier.description}</p></div>
          <div className="package-dialog-supporters"><h3>Supporters in this package</h3>{supporters.length ? supporters.map(sponsor => <article key={sponsor.id}>{sponsor.logo && <img src={sponsor.logo} alt={sponsor.name} width={210} height={80} />}<h4>{sponsor.name}</h4><p>{sponsor.contribution || sponsor.description}</p>{sponsor.website && <a href={sponsor.website} target="_blank" rel="noopener noreferrer">Visit supporter website</a>}</article>) : <p>No confirmed supporters in this package yet. Your organisation could be the first.</p>}
          <a className="brand-button brand-button-navy" href="#inquiry" onClick={close}>Discuss {tier.label.toLowerCase()} support</a><small>Recognition is agreed together. No fixed package prices are published.</small></div>
        </div></>}
    </dialog>
  </>
}
