import Link from 'next/link'
import { ArrowRight, BookOpen, TrafficCone } from 'lucide-react'
import SiteShell from '@/components/site-shell'

export default function NotFound() {
  return <SiteShell className="missing-page"><section className="site-container missing-layout"><div className="missing-sign" aria-hidden="true"><TrafficCone size={90} strokeWidth={1} /><span>404</span></div><div><span className="site-eyebrow">This road ends here</span><h1>Let’s get you<br />back on track.</h1><p>The page you’re looking for isn’t available. Head back to Igira or explore a learning guide.</p><div className="site-actions"><Link href="/" className="brand-button brand-button-navy">Back to home <ArrowRight size={18} /></Link><Link href="/blog" className="brand-text-link"><BookOpen size={18} />Explore the knowledge hub</Link></div></div></section></SiteShell>
}
