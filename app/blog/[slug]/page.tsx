import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, ArrowUpRight, Clock3 } from 'lucide-react'
import SiteShell from '@/components/site-shell'
import { APP_ORIGIN } from '@/lib/site-config'
import { blogArticles, getArticle } from '@/lib/blog-data'
import { landingPageAssets } from '@/lib/landing-assets'

export function generateStaticParams() { return blogArticles.map(({ slug }) => ({ slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const article = getArticle((await params).slug); return { title: article ? `${article.title} | Igira Provisoire` : 'Article | Igira Provisoire', description: article?.excerpt } }

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = getArticle((await params).slug)
  if (!article) notFound()
  const asset = landingPageAssets[article.imageKey]
  const related = blogArticles.filter(item => item.slug !== article.slug).slice(0, 2)
  return <SiteShell className="guide-page">
    <header className="guide-heading site-container"><nav className="site-breadcrumb" aria-label="Breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/blog">Knowledge hub</Link><span>/</span><span>{article.category}</span></nav><span className="site-eyebrow">{article.category}</span><h1>{article.title}</h1><p>{article.excerpt}</p><div className="guide-meta"><span>Igira learning guide</span><span><Clock3 size={15} />{article.readTime}</span></div></header>
    <div className="site-container"><div className="guide-cover"><img src={asset.src} alt={asset.alt} width={1200} height={700} /></div><div className="guide-layout"><article className="guide-body"><section id="understanding"><h2>Start with understanding</h2><p>Preparing for the road starts with understanding the choices we make as road users. This guide brings the most important ideas into a simple, practical format so you can study with clarity.</p></section><section id="context"><h2>Build understanding, not just memory</h2><p>Read each rule in context, then test yourself with practice questions. When you understand why a rule exists, it becomes easier to recognize and apply it on exam day and on the road.</p></section><section id="preparation"><h2>Keep your preparation consistent</h2><p>Short, focused study sessions can make a real difference. Review traffic rules, learn road signs and use timed mock tests to build confidence at your own pace.</p></section><div className="guide-note">Igira is a preparation resource. Always follow current official rules and examination guidance.</div></article><aside className="guide-sidebar"><span className="site-eyebrow">In this guide</span><nav aria-label="In this guide"><a href="#understanding">Start with understanding</a><a href="#context">Learn the context</a><a href="#preparation">Keep practising</a></nav><div className="guide-practice"><span>Make it practical</span><h3>Put your knowledge to the test.</h3><p>Continue your preparation in the Igira application.</p><a className="brand-button brand-button-navy" href={`${APP_ORIGIN}/practice`}>Open practice <ArrowUpRight size={17} /></a></div></aside></div></div>
    <section className="guide-related"><div className="site-container"><div className="site-section-heading"><div><span className="site-eyebrow">Continue learning</span><h2>Another step forward.</h2></div><Link href="/blog" className="brand-text-link">All articles <ArrowRight size={18} /></Link></div><div className="related-grid">{related.map(item => <Link key={item.slug} className="related-card" href={`/blog/${item.slug}`}><img src={landingPageAssets[item.imageKey].src} alt={landingPageAssets[item.imageKey].alt} width={300} height={220} loading="lazy" /><div><span>{item.category}</span><h3>{item.title}</h3><small>{item.readTime}</small></div><ArrowUpRight size={20} /></Link>)}</div></div></section>
  </SiteShell>
}
