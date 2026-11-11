import { validateInquiry } from './inquiry-submission'

type Env = Record<string, string | undefined>
const reply = (status: number, message: string) => Response.json({ message }, { status, headers: { 'Cache-Control': 'no-store' } })
export function inquiryReady(env: Env) {
  try {
    const backend = new URL(env.SUPABASE_SERVER_URL || '')
    const origin = new URL(env.INQUIRY_ALLOWED_ORIGIN || '')
    return backend.protocol === 'https:' && !backend.username && !backend.password && backend.pathname === '/' && !backend.search && !backend.hash && origin.protocol === 'https:' && origin.origin === env.INQUIRY_ALLOWED_ORIGIN && (env.INQUIRY_RATE_SECRET?.length || 0) >= 32 && ['SUPABASE_SERVICE_ROLE_KEY','TURNSTILE_SITE_KEY','TURNSTILE_SECRET_KEY'].every(key => !!env[key]) && env.INQUIRIES_ENABLED === 'true'
  } catch { return false }
}

export async function submitInquiry(request: Request, env: Env, transport: typeof fetch = fetch) {
  if (!inquiryReady(env)) return reply(503, 'Online inquiries are being connected. Please email info@igiraprovisoire.rw for now.')
  if (request.headers.get('origin') !== env.INQUIRY_ALLOWED_ORIGIN) return reply(403, 'This submission origin is not allowed.')
  if (!/^application\/json(?:;|$)/i.test(request.headers.get('content-type') || '')) return reply(415, 'Use a JSON request.')
  let data: ReturnType<typeof validateInquiry>
  try {
    const reader = request.body?.getReader()
    if (!reader) return reply(400, 'Please complete the form.')
    const chunks: Uint8Array[] = []; let size = 0
    try {
      while (true) {
        const {value, done} = await reader.read(); if (done) break
        size += value.byteLength
        if (size > 16384) { await reader.cancel(); return reply(413, 'The form is too large.') }
        chunks.push(value)
      }
    } finally { reader.releaseLock() }
    const bytes = new Uint8Array(size); let offset = 0
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length }
    data = validateInquiry(JSON.parse(new TextDecoder('utf-8', {fatal:true}).decode(bytes)))
  } catch { return reply(400, 'Please check the required fields, email and field limits.') }
  try {
    const verification = await transport('https://challenges.cloudflare.com/turnstile/v0/siteverify', {method:'POST', body:new URLSearchParams({secret:env.TURNSTILE_SECRET_KEY!,response:data.captcha}),signal:AbortSignal.timeout(8000)})
    if (!verification.ok) return reply(503, 'Verification is temporarily unavailable. Please retry.')
    const captcha = await verification.json()
    if (!captcha.success || captcha.hostname !== new URL(env.INQUIRY_ALLOWED_ORIGIN!).hostname || captcha.action !== 'partnership-inquiry') return reply(400, 'Please complete the security check again.')
    // Bound rate key avoids storing raw addresses. No browser forwarding header is trusted.
    const { createHmac } = await import('node:crypto')
    const rateKey = createHmac('sha256',env.INQUIRY_RATE_SECRET!).update(data.email.toLowerCase()).digest('hex')
    const {captcha: _, requestId, ...fields} = data
    const result = await transport(new URL('/rest/v1/rpc/submit_partnership_inquiry',env.SUPABASE_SERVER_URL), {method:'POST',headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY!,Authorization:`Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({p_request_id:requestId,p_fields:fields,p_rate_key:rateKey}),signal:AbortSignal.timeout(10000)})
    if (!result.ok) {
      const failure = await result.json().catch(()=>({}))
      if (failure.code === 'P4290') return reply(429, 'Too many inquiries. Please wait before trying again.')
      return reply(503, 'We could not confirm receipt. Please retry with the same form.')
    }
    return reply(201, 'Your inquiry has been received. Our team will review it and contact you.')
  } catch { return reply(503, 'We could not confirm receipt. Please retry with the same form.') }
}
