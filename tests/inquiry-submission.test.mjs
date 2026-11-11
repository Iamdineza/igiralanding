import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import vm from 'node:vm'
const require = createRequire(import.meta.url)
const ts = require('typescript')
const cache = new Map()
function load(name) {
  if(cache.has(name)) return cache.get(name)
  const exports = {}
  const source = readFileSync(new URL(`../lib/${name}.ts`,import.meta.url),'utf8')
  vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText,{exports,require:(name)=>name.startsWith('./')?load(name.slice(2)):require(name),Response,Request,URL,URLSearchParams,AbortSignal,TextDecoder,Uint8Array,Buffer,fetch})
  cache.set(name,exports); return exports
}
const {submitInquiry} = load('inquiry-server')
const {dispatchInquiryNotifications} = load('inquiry-notifications')
const env = {INQUIRIES_ENABLED:'true',SUPABASE_SERVER_URL:'https://supabase.example.invalid',SUPABASE_SERVICE_ROLE_KEY:'fixture-only',TURNSTILE_SITE_KEY:'fixture',TURNSTILE_SECRET_KEY:'fixture',INQUIRY_ALLOWED_ORIGIN:'https://about.example.invalid',INQUIRY_RATE_SECRET:'fixture-rate-secret-32-characters-long'}
const fields = {organization:"Learner's group'); DROP TABLE users; --",contact:'Fixture',email:'test@example.invalid',phone:'0780000000',interest:'Gold Sponsorship',budget:'',message:'<script>alert(1)</script>\nPlain text',captcha:'fixture-token',requestId:'00000000-0000-4000-8000-000000000001'}
const request = (data=fields,origin=env.INQUIRY_ALLOWED_ORIGIN)=>new Request('https://about.example.invalid/api/inquiries',{method:'POST',headers:{origin,'Content-Type':'application/json'},body:JSON.stringify(data)})
const never = ()=>{throw Error('Unexpected external call')}
test('actual inquiry handler fails closed without configuration and rejects foreign origins and invalid inputs',async()=>{
  assert.equal((await submitInquiry(request(),{},never)).status,503)
  assert.equal((await submitInquiry(request(),env,never)).status,503)
  assert.equal((await submitInquiry(request(fields,'https://attacker.invalid'),env,never)).status,403)
  for(const data of [{...fields,to:'attacker@example.invalid'},{...fields,email:'a@b.invalid\r\nBcc: evil'},{...fields,message:'x'.repeat(1501)},{...fields,interest:'admin'},{...fields,captcha:''}]) assert.equal((await submitInquiry(request(data),env,never)).status,400)
  assert.equal((await submitInquiry(request({...fields,message:'x'.repeat(17000)}),env,never)).status,413)
})
test('actual handler validates CAPTCHA action and hostname before any database operation',async()=>{
  for(const challenge of [{success:false},{success:true,hostname:'evil.invalid',action:'partnership-inquiry'},{success:true,hostname:'about.example.invalid',action:'login'}]) {
    let calls=0
    const result=await submitInquiry(request(),env,async()=>{calls++;return Response.json(challenge)})
    assert.equal(result.status,400);assert.equal(calls,1)
  }
})
test('actual handler binds untrusted text as JSON values, hashes rate identity and reports success only after persistence',async()=>{
  const calls=[]
  const transport=async(url,options)=>{
    calls.push([String(url),options])
    if(calls.length===1)return Response.json({success:true,hostname:'about.example.invalid',action:'partnership-inquiry'})
    return Response.json(fields.requestId)
  }
  const response=await submitInquiry(request(),env,transport)
  assert.equal(response.status,201);assert.equal(calls.length,2)
  assert.equal(calls[1][0],'https://supabase.example.invalid/rest/v1/rpc/submit_partnership_inquiry')
  const body=JSON.parse(calls[1][1].body)
  assert.equal(body.p_fields.organization,fields.organization);assert.equal(body.p_fields.message,fields.message)
  assert.match(body.p_rate_key,/^[a-f0-9]{64}$/);assert.equal(body.p_fields.captcha,undefined)
  for(const [code,status] of [['P4290',429],['42501',503],['XX000',503]]) {
    let n=0; const r=await submitInquiry(request(),env,async()=>++n===1?Response.json({success:true,hostname:'about.example.invalid',action:'partnership-inquiry'}):Response.json({code},{status:400}))
    assert.equal(r.status,status)
  }
})
test('notification worker rejects unauthorized callers and sends only summary with no message/contact data',async()=>{
  assert.equal((await dispatchInquiryNotifications(request(),{},never)).status,401)
  const workerEnv={...env,INQUIRY_WORKER_SECRET:'x'.repeat(40),TELEGRAM_BOT_TOKEN:'fixture',TELEGRAM_CHAT_ID:'fixture',INQUIRY_ADMIN_URL:'https://app.example.invalid/admin'}
  const req=new Request('https://about.example.invalid/api/inquiries/notifications',{method:'POST',headers:{Authorization:`Bearer ${workerEnv.INQUIRY_WORKER_SECRET}`}})
  const calls=[]
  const result=await dispatchInquiryNotifications(req,workerEnv,async(url,options)=>{
    calls.push([String(url),JSON.parse(options.body)])
    if(calls.length===1)return Response.json([{id:fields.requestId,lease:fields.requestId,interest:'Gold Sponsorship'}])
    if(calls.length===2)return Response.json({ok:true})
    return new Response(null,{status:204})
  })
  assert.equal(result.status,200);assert.equal((await result.json()).delivered,1)
  const summary=calls[1][1].text
  assert.match(summary,/Gold Sponsorship/);assert.match(summary,/section=inquiries/)
  assert.ok(!summary.includes(fields.email));assert.ok(!summary.includes(fields.message));assert.ok(!summary.includes(fields.organization))
  assert.equal(calls[2][1].p_success,true)
})
test('Telegram failure is acknowledged as retryable, never as delivered',async()=>{
  const workerEnv={...env,INQUIRY_WORKER_SECRET:'x'.repeat(40),TELEGRAM_BOT_TOKEN:'fixture',TELEGRAM_CHAT_ID:'fixture',INQUIRY_ADMIN_URL:'https://app.example.invalid/admin'}
  const req=new Request('https://about.example.invalid/api/inquiries/notifications',{method:'POST',headers:{Authorization:`Bearer ${workerEnv.INQUIRY_WORKER_SECRET}`}})
  let calls=0;let acknowledged
  const result=await dispatchInquiryNotifications(req,workerEnv,async(url,options)=>{
    calls++
    if(calls===1)return Response.json([{id:fields.requestId,lease:fields.requestId,interest:'Gold Sponsorship'}])
    if(calls===2)throw Error('Fixture provider outage')
    acknowledged=JSON.parse(options.body)
    return new Response(null,{status:204})
  })
  assert.equal(result.status,200);assert.equal((await result.json()).delivered,0)
  assert.equal(acknowledged.p_success,false)
})

 test('browser payload excludes CAPTCHA-injected fields while server rejects unexpected fields', async () => {
  const source = readFileSync(new URL('../components/sponsor-components.tsx', import.meta.url), 'utf8')
  const expression = source.match(/const payload = (Object\.fromEntries\(\['organization'[^\n]+)/)?.[1]
  assert.ok(expression)
  const formData = new FormData()
  for (const [key, value] of Object.entries(fields)) formData.set(key, value)
  formData.set('cf-turnstile-response', 'widget-generated-token')
  const payload = vm.runInNewContext(expression, { formData })
  assert.equal(payload['cf-turnstile-response'], undefined)
  assert.equal(payload.organization, fields.organization)
  const { validateInquiry } = load('inquiry-submission')
  assert.doesNotThrow(() => validateInquiry({...payload, captcha: fields.captcha, requestId: fields.requestId}))
  assert.equal((await submitInquiry(request({...fields, 'cf-turnstile-response': 'widget-generated-token'}), env, never)).status, 400)
})
