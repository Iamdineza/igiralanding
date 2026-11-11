'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Search } from 'lucide-react'
import { blogArticles, blogCategories } from '@/lib/blog-data'
import { landingPageAssets } from '@/lib/landing-assets'

export function BlogIndexGrid() {
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('category')
    if (requested && blogCategories.some(item => item === requested)) setCategory(requested)
  }, [])
  const articles = blogArticles.filter(article => (category === 'All' || article.category === category) && article.title.toLowerCase().includes(search.trim().toLowerCase()))
  const showFeatured = category === 'All' && !search.trim()
  const featured = showFeatured ? articles[0] : undefined
  const rest = featured ? articles.slice(1) : articles
  return <>
    <div className="resource-toolbar"><div role="group" aria-label="Article categories">{blogCategories.map(item => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="resource-search"><Search size={18} /><input type="search" aria-label="Search articles" placeholder="Search the knowledge hub" value={search} maxLength={100} onChange={event => setSearch(event.target.value)} /></label></div>
    {featured && <article className="resource-feature"><Link className="resource-feature-image" href={`/blog/${featured.slug}`} aria-label={`Read ${featured.title}`}><img src={landingPageAssets[featured.imageKey].src} alt={landingPageAssets[featured.imageKey].alt} width={1000} height={700} /></Link><div className="resource-feature-copy"><span className="site-eyebrow">Start here</span><div className="resource-meta"><span>{featured.category}</span><span>{featured.readTime}</span></div><h2><Link href={`/blog/${featured.slug}`}>{featured.title}</Link></h2><p>{featured.excerpt}</p><Link className="brand-text-link" href={`/blog/${featured.slug}`}>Read the guide <ArrowUpRight size={18} /></Link></div></article>}
    <div className="resource-result-heading"><h2>{showFeatured ? 'More to explore' : category === 'All' ? 'Search results' : category}</h2><span aria-live="polite">{articles.length} {articles.length === 1 ? 'article' : 'articles'}</span></div>
    <div className="resource-grid">{rest.map(article => <article className="resource-card" key={article.slug}><Link className="resource-card-image" href={`/blog/${article.slug}`} aria-label={`Read ${article.title}`}><img src={landingPageAssets[article.imageKey].src} alt={landingPageAssets[article.imageKey].alt} width={650} height={430} loading="lazy" /></Link><div className="resource-meta"><span>{article.category}</span><span>{article.readTime}</span></div><h3><Link href={`/blog/${article.slug}`}>{article.title}</Link></h3><p>{article.excerpt}</p><Link className="brand-text-link" href={`/blog/${article.slug}`}>Read article <ArrowUpRight size={16} /></Link></article>)}</div>
    {articles.length === 0 && <div className="resource-empty" role="status"><h3>No articles found.</h3><p>Try another search or browse all topics.</p><button type="button" className="brand-button brand-button-navy" onClick={() => { setCategory('All'); setSearch('') }}>Show all articles</button></div>}
  </>
}
