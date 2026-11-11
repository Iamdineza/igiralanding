'use client'

import { Building2 } from 'lucide-react'

export default function SupporterSpaces() {
  return <section className="supporter-spaces" aria-labelledby="supporter-spaces-title">
    <div className="site-container supporter-spaces-heading">
      <div><h2 id="supporter-spaces-title">Room for more supporters.</h2><p>Available logo spaces for future partners. These are placeholders, not confirmed supporters.</p></div>
    </div>
    <div className="supporter-marquee" tabIndex={0} role="region" aria-label="Future supporter spaces; hover or focus to pause">
      <div className="supporter-marquee-track">
        {[0, 1].map(copy => <div className="supporter-marquee-group" key={copy} aria-hidden={copy === 1 ? true : undefined}>
          {Array.from({length: 6}, (_, i) => <div className="supporter-logo-space" key={i}><Building2 size={25} strokeWidth={1.3} /><span>Your logo here<small>Supporter space available</small></span></div>)}
        </div>)}
      </div>
    </div>
  </section>
}
