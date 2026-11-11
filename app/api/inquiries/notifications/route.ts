import { dispatchInquiryNotifications } from '@/lib/inquiry-notifications'
export const runtime = 'nodejs'
export function POST(request: Request) { return dispatchInquiryNotifications(request,process.env) }
