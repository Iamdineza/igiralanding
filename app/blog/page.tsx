import { Footer, LandingNavbar } from '@/components/landing-page'
import { BlogIndexGrid } from '@/components/blog-index'

export const metadata = { title: 'Blog | Igira Provisoire', description: 'Driving theory education, traffic rules and road signs for Rwanda.' }

export default function BlogPage() {
  return <main className="subpage"><LandingNavbar /><header className="subpage-header"><span className="pill">KNOWLEDGE HUB</span><h1>Learn beyond the <em>test.</em></h1><p>Clear, practical guidance for Rwanda&apos;s roads, rules and driving theory test.</p></header><section className="blog-index"><BlogIndexGrid /></section><Footer /></main>
}
