import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { blogArticles, getArticle } from '@/lib/blog-data'

export function generateStaticParams() { return blogArticles.map(({ slug }) => ({ slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) { const article = getArticle((await params).slug); return { title: article ? `${article.title} | Igira Provisoire` : 'Article | Igira Provisoire', description: article?.excerpt } }

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = getArticle((await params).slug)
  if (!article) notFound()
  return <main className="subpage article-page"><header className="article-header"><Link href="/blog" className="back-link"><ArrowLeft size={16} /> Back to blog</Link><span className="pill">{article.category}</span><h1>{article.title}</h1><p>{article.excerpt}</p><span className="article-read">{article.readTime} · Igira Provisoire</span></header><article className="article-body"><div className="image-placeholder article-hero-image"><span>IMAGE PLACEHOLDER</span><strong>{article.imageKey.replace(/([A-Z])/g, ' $1')}</strong></div><p>Preparing for the road starts with understanding the choices we make as road users. This guide brings the most important ideas into a simple, practical format so you can study with clarity.</p><h2>Build understanding, not just memory</h2><p>Read each rule in context, then test yourself with practice questions. When you understand why a rule exists, it becomes easier to recognize and apply it on exam day and on the road.</p><h2>Keep your preparation consistent</h2><p>Short, focused study sessions can make a real difference. Review traffic rules, learn road signs and use timed mock tests to build confidence at your own pace.</p><Link href="https://www.igiraprovisoire.rw" className="button button-yellow">Get Started <ArrowRight size={17} /></Link></article></main>
}
