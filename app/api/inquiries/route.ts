import { after } from 'next/server'
import { dispatchInquiryNotifications } from '@/lib/inquiry-notifications'
import { inquiryReady, submitInquiry } from '@/lib/inquiry-server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export function GET() {
  const enabled = inquiryReady(process.env)
  return Response.json({ enabled, siteKey: enabled ? process.env.TURNSTILE_SITE_KEY : null }, {headers:{'Cache-Control':'no-store'}})
}
export async function POST(request: Request) {
  const response = await submitInquiry(request, process.env)
  if (response.status === 201) {
    after(async () => {
      try {
        await dispatchInquiryNotifications(new Request('http://localhost/api/inquiries/notifications', {
          method: 'POST',
          headers: { Authorization: `Bearer ${process.env.INQUIRY_WORKER_SECRET || ''}` },
        }), process.env)
      } catch { /* The timer retries queued notifications without affecting the saved inquiry. */ }
    })
  }
  return response
}
