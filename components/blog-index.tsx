'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { blogArticles, blogCategories } from '@/lib/blog-data'
import { landingPageAssets } from '@/lib/landing-assets'

export function BlogIndexGrid() {
  const [activeCategory, setActiveCategory] = React.useState('All')
  const categories = Array.from(new Set(['All', ...blogCategories.filter((category) => category !== 'Featured')]))
  const visibleArticles = activeCategory === 'All' ? blogArticles : blogArticles.filter((article) => article.category === activeCategory)
  return <><div className="category-tabs" role="tablist" aria-label="Filter articles">{categories.map((category) => <button key={category} className={activeCategory === category ? 'active' : ''} onClick={() => setActiveCategory(category)} role="tab" aria-selected={activeCategory === category}>{category}</button>)}</div><div className="blog-index-grid">{visibleArticles.map((article) => { const asset = landingPageAssets[article.imageKey]; return <article className="blog-index-card" key={article.slug}><div className="blog-card-image"><img src={asset.src} alt={asset.alt} /></div><div className="article-meta"><span>{article.category}</span><span>{article.readTime}</span></div><h2>{article.title}</h2><p>{article.excerpt}</p><Link href={`/blog/${article.slug}`} className="text-link">Read article <ArrowRight size={16} /></Link></article> })}</div></>
}
