import { SITE_ORIGIN } from '@/lib/site-config'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import './brand.css'
import './site-pages.css'

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-dm-sans' })

export const metadata: Metadata = {
  title: 'Igira Provisoire | Driving Test Preparation in Rwanda',
  description: "Prepare for Rwanda's driving theory test with practice questions, mock tests, traffic rules and road sign education in English, French and Kinyarwanda.",
  generator: 'Igira Provisoire',
  icons: { icon: [{ url: '/favicon.png', type: 'image/png' }], shortcut: '/favicon.ico', apple: '/apple-icon.png' },
  metadataBase: new URL(SITE_ORIGIN),
  openGraph: { title: 'Igira Provisoire | Driving Test Preparation in Rwanda', description: "Prepare for Rwanda's driving theory test with confidence.", type: 'website' },
}

export const viewport: Viewport = { colorScheme: 'light', themeColor: '#0B2B51', width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="bg-background"><body className={`${dmSans.variable} antialiased`}>{children}{process.env.NEXT_PUBLIC_ENABLE_VERCEL_ANALYTICS === 'true' && <Analytics />}</body></html>
}
