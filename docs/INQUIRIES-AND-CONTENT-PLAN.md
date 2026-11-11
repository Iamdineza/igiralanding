# Status update — 2026-11-10

Inquiry submission, administrator inbox, forward migration and Telegram outbox worker are now implemented locally. They have not been deployed or configured. See [INQUIRY-INBOX-SETUP.md](INQUIRY-INBOX-SETUP.md). Email delivery is not required; Telegram summaries link to the private inbox. The earlier design notes below describe the original proposal; blog editing remains a future batch.

# Inquiry and content backend contract — not yet implemented

## Confirmed addresses

The existing web application stays at `https://igiraprovisoire.rw`, preserving the established root/www behavior. The separate landing page is planned for `https://about.igiraprovisoire.rw`. Its application links point to the main domain. The public API remains planned for `https://api.igiraprovisoire.rw`.

The current local form opens a user-reviewed draft addressed to `info@igiraprovisoire.rw`. It does **not** yet save an inquiry, send email automatically, or notify Telegram. Those features need the next backend batch; no new database migration has been created/applied for them in this UI batch.

## Required security design

1. Browser submits a bounded JSON body to a fixed `submit-inquiry` Edge Function. Enforce POST, JSON, body byte limits, expected fields, string types and field limits. Normalize text to Unicode NFC and trim edges. Reject unexpected control characters. Use conservative email validation and reject CR/LF in any mail header field. Never accept notification recipients, SQL identifiers, table names, roles or delivery URLs from the request.
2. Verify Turnstile server-side, including the configured landing hostname. Enforce rate limits based on a proxy-verified IP, fail closed on registration/inquiry verification outages, and add idempotency to avoid duplicate rows on retries. CORS is not authorization. Service credentials remain in Edge Function secrets.
3. Use Supabase structured data/RPC calls with static field names. PostgREST binds database values; do not concatenate user input into SQL, `.or()` filter expressions or dynamic identifiers. If a server PostgreSQL client is later used, use `$1`, `$2`, etc. with a values array. Sanitizing a string is not a substitute for parameter binding. Apostrophes and normal punctuation should remain valid text.
4. Save `partnership_inquiries` and its notification-outbox job in one transaction, through a narrowly scoped backend-only operation. Grant no anonymous/authenticated direct insert/update/delete route that could bypass CAPTCHA. Anonymous users must never read inquiries, even by knowing an ID. Dashboard reads/status changes are limited to verified administrators; school owners, students, staff and partners receive no implicit access.
5. Store inquiry content as plain text. Render with ordinary React text nodes, never `dangerouslySetInnerHTML`. HTML email templates must escape each untrusted value; Telegram can use plain text without parse mode. Do not store arbitrary executable HTML or strip SQL keywords to pretend input is safe.
6. Send email to the fixed approved mailbox using a server-configured provider. Keep user email in a separately validated Reply-To field, not as the envelope sender. Send Telegram a short notification linking to the administrator inbox rather than full private message content. Credentials, tokens and inquiry bodies must not appear in logs.
7. Process notifications from an outbox with bounded retries, leases for concurrent workers and recorded delivery state. A notification failure must not discard the saved inquiry. Return success only for a saved inquiry, with clear delivery-independent wording. Email provider idempotency should be used where supported; Telegram can require at-least-once handling rather than claiming guaranteed exactly-once delivery.

Illustrative structured insert, not an installed endpoint:

```ts
const { error } = await serviceClient.from('partnership_inquiries').insert({
  organization: validated.organization,
  contact_name: validated.contact,
  email: validated.email,
  phone: validated.phone,
  interest: validated.interest,
  message: validated.message,
});
```

The final implementation must make the outbox atomic as described above; two independent client inserts are not equivalent to a transaction.

## Blog and dashboard permissions

`blog_posts` should separate draft and published states, with stable slugs, timestamps and author/editor IDs. Only verified administrators can create/edit/publish. Public reads must select only published posts whose publication time has arrived, with pagination and limited columns. Use sanitized Markdown with raw HTML disabled or a reviewed server-side allowlist if rich HTML is needed. Permit only safe link/image URL schemes; avoid loading arbitrary internal URLs through server image fetches.

The main dashboard needs separate Blog and Inquiries sections. Inquiry status/read markers must not broaden existing school/staff permissions. Public pages must not receive inquiry or draft content in SSR payloads, static output or shared caches. Publishing must trigger narrowly authenticated cache invalidation.

## Required verification before applying forward migrations

- Injection payloads, quotes, Unicode, markup, oversized bodies, unexpected fields and invalid JSON.
- Missing/forged/replayed CAPTCHA, invalid hostnames, provider failures, throttling and spoofed forwarding headers.
- Anonymous/student/owner/staff/partner direct REST reads and writes denied for inquiries/outbox; genuine administrators authorized; service backend paths verified.
- Duplicate submissions and concurrent notification workers; provider outages; retry ownership; no lost inquiries or false delivery confirmations.
- Draft visibility, future publication, cross-role edits, unsafe Markdown/links, cache invalidation and no private payload leakage.
- Existing registration, examination and licensing regressions.

Test against an isolated PostgreSQL/PostgREST environment. Create forward migrations only, inspect the actual restored schema first, and do not automatically apply migrations to the VPS or Lovable.

References: [PostgREST parameterized queries](https://docs.postgrest.org/en/v14/references/configuration.html#db-prepared-statements), [Supabase structured inserts](https://supabase.com/docs/reference/javascript/insert).

## Sokrab credit and UI

The main app's local `HostingCredit` component displays “Hosting supported by Sokrab Group” through the shared footer. It does not claim Sokrab authors or certifies examinations, and it does not interrupt timed exams or practice. No automatic popup was added. The landing preview uses the same hosting-support wording.

The premium homepage uses navy, warm white and road-sign yellow, a real product screenshot preview, three preparation steps, language information, article discovery and a partnership path. Unsupported school/store launch claims and stock-photo testimonials are absent from this new homepage. Existing secondary-page content still needs editorial approval.
