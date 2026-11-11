import SiteShell from '@/components/site-shell'
import { BlogIndexGrid } from '@/components/blog-index'

export const metadata = { title: 'Blog | Igira Provisoire', description: 'Driving theory education, traffic rules and road signs for Rwanda.' }

export default function BlogPage() {
  return <SiteShell className="resource-page">
    <header className="site-page-heading site-container">
      <span className="site-eyebrow">The Igira knowledge hub</span>
      <div className="site-heading-split"><h1>Good preparation<br />starts with understanding.</h1><p>Explore traffic rules, road signs and practical ways to prepare for Rwanda’s driving theory examination.</p></div>
    </header>
    <section className="site-container resource-library" aria-label="Learning articles"><BlogIndexGrid /></section>
  </SiteShell>
}
