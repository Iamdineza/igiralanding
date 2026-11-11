import { timingSafeEqual } from 'node:crypto'

export async function dispatchInquiryNotifications(request: Request, env: Record<string,string|undefined>, transport: typeof fetch = fetch) {
  const secret = env.INQUIRY_WORKER_SECRET || ''
  const given = request.headers.get('authorization') || ''
  const expected = `Bearer ${secret}`
  if (secret.length < 32 || Buffer.byteLength(given) !== Buffer.byteLength(expected) || !timingSafeEqual(Buffer.from(given),Buffer.from(expected))) return Response.json({message:'Unauthorized'},{status:401})
  if (!env.SUPABASE_SERVER_URL || !env.SUPABASE_SERVICE_ROLE_KEY || !env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID || !env.INQUIRY_ADMIN_URL) return Response.json({message:'Notification worker is not configured.'},{status:503})
  const admin = new URL(env.INQUIRY_ADMIN_URL)
  if (admin.protocol !== 'https:' || admin.username || admin.password || admin.search || admin.hash) return Response.json({message:'Invalid inbox configuration.'},{status:503})
  admin.searchParams.set('section','inquiries')
  async function rpc(name: string, body: object) {
    const response = await transport(new URL(`/rest/v1/rpc/${name}`,env.SUPABASE_SERVER_URL),{method:'POST',headers:{apikey:env.SUPABASE_SERVICE_ROLE_KEY!,Authorization:`Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(8000)})
    if(!response.ok) throw Error('Database request failed')
    return response.status === 204 ? null : response.json()
  }
  try {
    const jobs = await rpc('claim_partnership_notifications',{}) as Array<{id:string;lease:string;interest:string}>
    let delivered = 0
    for (const job of jobs) {
      let success = false
      try {
        const response = await transport(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({chat_id:env.TELEGRAM_CHAT_ID,text:`New Igira partnership inquiry\nInterest: ${job.interest}\nReference: ${job.id}\nReview securely: ${admin.href}`,link_preview_options:{is_disabled:true}}),signal:AbortSignal.timeout(8000)})
        success = response.ok && (await response.json()).ok === true
      } catch { /* Keep the saved inquiry and retry its notification later. */ }
      await rpc('finish_partnership_notification',{p_id:job.id,p_lease:job.lease,p_success:success})
      if(success) delivered++
    }
    return Response.json({processed:jobs.length,delivered},{headers:{'Cache-Control':'no-store'}})
  } catch { return Response.json({message:'Notification attempt could not be completed.'},{status:503}) }
}
