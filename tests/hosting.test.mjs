import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import vm from 'node:vm'
import { test } from 'node:test'

const ts = createRequire(import.meta.url)('typescript')
function config(env) {
  const exports = {}
  const source = readFileSync(new URL('../lib/site-config.ts', import.meta.url), 'utf8')
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText,
    { exports, URL, process: { env } })
  return exports
}
test('actual link configuration separates landing and application defaults', () => {
  const value = config({})
  assert.equal(value.APP_ORIGIN, 'https://igiraprovisoire.rw')
  assert.equal(value.SITE_ORIGIN, 'https://home.igiraprovisoire.rw')
})
test('actual link configuration rejects unsafe schemes, credentials, paths and queries', () => {
  for (const value of ['javascript:alert(1)', 'http://example.org', 'https://user:pass@example.org', 'https://example.org/path', 'https://example.org/?secret=x', 'https://example.org/#x']) {
    assert.throws(() => config({ NEXT_PUBLIC_APP_URL: value }))
    assert.throws(() => config({ NEXT_PUBLIC_SITE_URL: value }))
  }
  assert.equal(config({ NEXT_PUBLIC_APP_URL: 'http://127.0.0.1:5173' }).APP_ORIGIN, 'http://127.0.0.1:5173')
})

test('real production HTTP routes, security headers, app links and private-inbox inquiry form', { skip: !process.env.LANDING_TEST_URL, timeout: 30000 }, async () => {
  const base = new URL(process.env.LANDING_TEST_URL)
  const privateLan = process.env.LANDING_ALLOW_PRIVATE_NETWORK === 'true' && /^192\.168\.\d{1,3}\.\d{1,3}$/.test(base.hostname)
  assert.ok(['127.0.0.1', 'localhost', '[::1]'].includes(base.hostname) || privateLan, 'Use a local preview; LAN testing requires an explicit private-network flag')
  assert.equal(base.protocol, 'http:')
  const request = path => fetch(new URL(path, base), { signal: AbortSignal.timeout(5000), redirect: 'manual' })
  const health = await request('/healthz')
  assert.equal(health.status, 200)
  assert.deepEqual(await health.json(), { status: 'ok' })
  assert.match(health.headers.get('cache-control'), /no-store/)
  for (const path of ['/', '/blog', '/blog/right-of-way-rwanda', '/blog/traffic-rules-every-learner', '/blog/warning-road-signs', '/blog/prepare-driving-theory-test', '/creator', '/sponsors']) {
    const response = await request(path)
    assert.equal(response.status, 200, path)
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff')
    assert.equal(response.headers.get('x-frame-options'), 'DENY')
    assert.equal(response.headers.get('x-powered-by'), null)
    const html = await response.text()
    for (const label of ['About', 'How It Works', 'Blog', 'Sponsors', 'For Driving Schools', 'Advertise With Us', 'Creator']) {
      assert.ok(html.includes(label), `${path}: missing navigation item ${label}`)
    }
    assert.ok(html.includes('href="https://igiraprovisoire.rw'), `${path}: application links`)
    assert.ok(html.includes('href="https://igiraprovisoire.rw/privacy"'), `${path}: privacy link`)
    if (path === '/') {
      assert.ok(html.includes('igira-brand-page'))
      assert.ok(html.includes('Your journey to'))
      for (const match of html.matchAll(/href="\/?#([^"?]+)"/g)) {
        assert.ok(html.includes(`id="${match[1]}"`), `Missing homepage anchor: ${match[1]}`)
      }
    }
    if (path === '/creator') assert.match(html, /mailto:didier@igiraprovisoire.rw/)
    if (path === '/sponsors') {
      assert.ok(!html.includes('How this form works'))
      assert.match(html, /method="post"/)
      assert.match(html, /mailto:info@igiraprovisoire.rw/)
      assert.match(html, /Send inquiry/)
      assert.match(html, /Online submission is not connected/)
      assert.match(html, /partner-tiers/)
      assert.ok(!html.includes('Reserved badge artwork'), 'Unfinished badge placeholders must not appear')
    }
    if (path !== '/') assert.ok(html.includes('igira-site-page'), `${path}: shared redesigned page shell`)
    for (const match of html.matchAll(/href="#([^"?]+)"/g)) {
      assert.ok(html.includes(`id="${match[1]}"`), `${path}: missing local anchor ${match[1]}`)
    }
    assert.ok(!html.includes('/_vercel/insights/script.js'), 'Analytics must remain opt-in')
  }
  for (const path of ['/favicon.ico','/favicon.png','/apple-icon.png']) {
    const icon = await request(path); assert.equal(icon.status,200,path); assert.match(icon.headers.get('content-type'),/image\//);
  }
  assert.equal((await request('/blog/not-a-real-article')).status, 404)
  const missing = await request('/not-a-real-page')
  assert.equal(missing.status, 404)
  assert.match(await missing.text(), /back on track/)
})

test('actual inquiry draft encodes untrusted fields and rejects missing or oversized content', () => {
  const exports = {}
  const source = readFileSync(new URL('../lib/inquiry.ts', import.meta.url), 'utf8')
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports, encodeURIComponent })
  const form = new FormData()
  for (const key of ['organization','contact','email','phone','interest','message']) form.set(key, 'Fixture &cc=attacker@example.invalid')
  form.set('phone', '0781234567')
  form.set('budget', '')
  const url = new URL(exports.inquiryDraft(form))
  assert.equal(url.protocol, 'mailto:')
  assert.equal(url.pathname, 'info@igiraprovisoire.rw')
  assert.deepEqual([...url.searchParams.keys()], ['subject','body'])
  form.set('message', 'x'.repeat(1501))
  assert.throws(() => exports.inquiryDraft(form))
  assert.throws(() => exports.inquiryDraft(new FormData()))
})
