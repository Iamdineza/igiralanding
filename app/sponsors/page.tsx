import type { Metadata } from 'next'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { Footer, LandingNavbar } from '@/components/landing-page'

export const metadata: Metadata = {
  title: 'Our Sponsors | Igira Provisoire',
  description: 'Meet the partners supporting accessible driving theory preparation in Rwanda.',
}

export default function SponsorsPage() {
  return (
    <main className="sponsors-page">
      <LandingNavbar />
      <header className="sponsors-hero">
        <div className="container">
          <span className="pill">OUR SPONSORS</span>
          <h1>Partners for the road ahead.</h1>
          <p>We are grateful to the organizations helping make better driving theory preparation more accessible across Rwanda.</p>
        </div>
      </header>
      <section className="sponsors-content" aria-labelledby="diamond-sponsor-title">
        <div className="container">
          <div className="sponsor-feature">
            <div className="sponsor-feature-copy">
              <span className="sponsor-tier">DIAMOND SPONSOR</span>
              <h2 id="diamond-sponsor-title">Sokrab</h2>
              <p>Sokrab is supporting Igira Provisoire as we build clearer, more practical preparation for Rwanda&apos;s future drivers.</p>
              <a className="button button-navy" href="https://sokrab.com/home" target="_blank" rel="noreferrer">Visit Sokrab <ExternalLink size={16} /></a>
            </div>
            <a className="sponsor-logo-lockup" href="https://sokrab.com/home" target="_blank" rel="noreferrer" aria-label="Visit Sokrab, Diamond Sponsor">
              <span className="sponsor-tier">DIAMOND SPONSOR</span>
              <img src="/sokrab-logo-black.png" alt="Sokrab logo" />
              <span className="sponsor-link">sokrab.com <ArrowRight size={15} /></span>
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
