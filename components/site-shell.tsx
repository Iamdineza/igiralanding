import type { ReactNode } from 'react'
import BrandNavbar from '@/components/brand-navbar'
import { Footer } from '@/components/landing-page'

export default function SiteShell({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <main className={`igira-site-page ${className}`}>
    <BrandNavbar />
    {children}
    <div className="brand-road-pattern" aria-hidden="true" />
    <Footer />
  </main>
}
