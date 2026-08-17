import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-dm-sans' })

export const metadata: Metadata = {
  title: 'Igira Provisoire | Driving Test Preparation in Rwanda',
  description: "Prepare for Rwanda's driving theory test with practice questions, mock tests, traffic rules and road sign education in English, French and Kinyarwanda.",
  generator: 'Igira Provisoire',
  openGraph: { title: 'Igira Provisoire | Driving Test Preparation in Rwanda', description: "Prepare for Rwanda's driving theory test with confidence.", type: 'website' },
}

export const viewport: Viewport = { colorScheme: 'light', themeColor: '#0B2B51', width: 'device-width', initialScale: 1 }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="bg-background"><body className={`${dmSans.variable} antialiased`}>{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
