import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return <main className="not-found-page"><div className="not-found-road" aria-hidden="true"><span className="road-dash dash-one" /><span className="road-dash dash-two" /><span className="road-dash dash-three" /><div className="not-found-car"><span className="car-window" /><span className="car-wheel wheel-left" /><span className="car-wheel wheel-right" /></div></div><div className="not-found-copy"><span className="pill">404 / WRONG TURN</span><p className="not-found-number">4<span>0</span>4</p><h1>This page took a wrong turn.</h1><p>Looks like this road does not exist. Let&apos;s get you back to the route that helps you prepare with confidence.</p><div className="not-found-actions"><Link className="button button-yellow" href="/">Back to home <ArrowRight size={17} /></Link><Link className="text-link" href="/blog"><ArrowLeft size={16} /> Explore the blog</Link></div></div></main>
}
