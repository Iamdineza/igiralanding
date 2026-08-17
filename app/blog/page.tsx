import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { blogArticles, blogCategories } from '@/lib/blog-data'
import { landingPageAssets } from '@/lib/landing-assets'

export const metadata = { title: 'Blog | Igira Provisoire', description: 'Driving theory education, traffic rules and road signs for Rwanda.' }

export default function BlogPage() {
  return <main className="subpage"><header className="subpage-header"><Link href="/" className="back-link"><ArrowLeft size={16} /> Igira Provisoire</Link><span className="pill">KNOWLEDGE HUB</span><h1>Learn beyond the <em>test.</em></h1><p>Clear, practical guidance for Rwanda&apos;s roads, rules and driving theory test.</p></header><section className="blog-index"><div className="category-tabs">{blogCategories.map((category) => <span key={category}>{category}</span>)}</div><div className="blog-index-grid">{blogArticles.map((article) => <article className="blog-index-card" key={article.slug}><div className="image-placeholder"><span>IMAGE PLACEHOLDER</span><strong>{article.imageKey.replace(/([A-Z])/g, ' $1')}</strong></div><div className="article-meta"><span>{article.category}</span><span>{article.readTime}</span></div><h2>{article.title}</h2><p>{article.excerpt}</p><Link href={`/blog/${article.slug}`} className="text-link">Read article <ArrowRight size={16} /></Link></article>)}</div></section></main>
}
