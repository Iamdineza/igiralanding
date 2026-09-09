import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { blogArticles, getArticle } from '@/lib/blog-data'
import { landingPageAssets } from '@/lib/landing-assets'
import { Footer, LandingNavbar } from '@/components/landing-page'

export function generateStaticParams() { return blogArticles.map(({ slug }) => ({ slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const article = getArticle((await params).slug); return { title: article ? `${article.title} | Igira Provisoire` : 'Article | Igira Provisoire', description: article?.excerpt } }

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = getArticle((await params).slug)
  if (!article) notFound()
  const asset = landingPageAssets[article.imageKey]
  return <main className="subpage article-page"><LandingNavbar /><header className="article-header"><Link href="/blog" className="article-back-link"><ArrowLeft size={16} /> <span>Back to blog</span></Link><span className="pill">{article.category}</span><h1>{article.title}</h1><p>{article.excerpt}</p><span className="article-read">{article.readTime} · Igira Provisoire</span></header><article className="article-body"><div className="article-hero-image"><img src={asset.src} alt={asset.alt} /></div><p>Preparing for the road starts with understanding the choices we make as road users. This guide brings the most important ideas into a simple, practical format so you can study with clarity.</p><h2>Build understanding, not just memory</h2><p>Read each rule in context, then test yourself with practice questions. When you understand why a rule exists, it becomes easier to recognize and apply it on exam day and on the road.</p><h2>Keep your preparation consistent</h2><p>Short, focused study sessions can make a real difference. Review traffic rules, learn road signs and use timed mock tests to build confidence at your own pace.</p><Link href="https://www.igiraprovisoire.rw" className="button button-yellow">Get Started <ArrowRight size={17} /></Link></article><Footer /></main>
}
