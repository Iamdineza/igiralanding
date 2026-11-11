# Inquiry inbox and sponsorship interaction batch

## Implemented locally

- Tier cards lift slightly on hover and open a native modal dialog. The badge appears beside the confirmed supporters assigned to that tier; no prospective organisations are shown as confirmed. Empty tiers have an explicit empty state. Escape, close button and backdrop dismiss the dialog. Reduced motion disables hover transforms.
- Badges retain the footer logo and metal shield; decorative dots, arrow and sparkle are removed.
- Placeholder strip pauses on hover and keyboard focus, with no visible resume/pause button. Reduced motion stops it entirely.
- Homepage navigation destinations come first (About, How It Works, For Driving Schools), followed by Blog, Sponsors and Advertise With Us.
- The form posts to the same-origin `/api/inquiries`. It no longer opens a mail composer. It is visibly disabled until server configuration is ready. Success means a database receipt, not Telegram delivery.

## Database / application counterpart

In the existing application worktree `C:/Users/Sokrab Group/.codex/worktrees/vps-migration-sync/igira-provisoire-main`:

- Forward migration: `supabase/migrations/20261110150000_partnership_inquiries.sql`.
- Inbox UI: `src/components/PartnershipInbox.tsx`, mounted for administrators only in `src/pages/Admin.tsx`.
- Two typed administrator RPCs added to `src/integrations/supabase/types.ts`.
- Database tests: `supabase/tests/partnership-inquiries.test.mjs`.

No existing migration was edited and nothing was applied to a live database. The migration requires the existing verified `auth.uid()`, `auth.role()`, `public.app_role` and `public.has_role` functions. Review these against the target restored schema first. New tables have RLS, no public/authenticated direct grants, and backend-only submission/outbox RPCs. Admin RPCs verify an actual admin role using the existing helper. The inbox paginates 25 records and renders submitted text as React text, never HTML.

## Configuration and deployment order (not executed)

1. Back up and review the database. Test the forward migration in an isolated copy, including REST grants and real Supabase identities. PGlite tests are useful PostgreSQL validation but do not prove gateway/auth infrastructure compatibility or concurrent multi-connection behavior.
2. Apply the reviewed migration through the normal approved deployment workflow. Deploy the main application inbox before enabling submissions. The Telegram link is `/admin?section=inquiries`; users must still authenticate as administrators.
3. Configure the landing container's **server-only** variables from `.env.example`. `SUPABASE_SERVER_URL` must be an HTTPS origin. Use a private secret store/environment file, never client variables or Git. `INQUIRY_RATE_SECRET` and `INQUIRY_WORKER_SECRET` need at least 32 random characters. Reuse the approved Telegram bot/chat if appropriate without exposing its token. Configure a Turnstile widget for the real landing hostname; action is `partnership-inquiry`.
4. Keep `INQUIRIES_ENABLED=false` until the migration, CAPTCHA and inbox have been tested. `INQUIRY_ALLOWED_ORIGIN` is the exact HTTPS landing origin, with no trailing slash. `INQUIRY_ADMIN_URL` is the fixed HTTPS `/admin` URL, with no query; the worker adds its inbox selector.
5. Restrict the reverse proxy to bounded POST bodies (16 KiB), bounded client-body timeouts, and an IP request limit on `/api/inquiries`. The handler does not trust browser `X-Forwarded-For`. Its database limit is 3 saved inquiries per hashed email/hour plus 60 total/hour, enforced under one transaction lock. Rotating the rate secret resets per-email buckets; protect and retain it.
6. Schedule a server-side POST every minute to `/api/inquiries/notifications` with `Authorization: Bearer <INQUIRY_WORKER_SECRET>`. Store the authorization header in a private curl config/secret file, rather than exposing it in shell history or process arguments. The endpoint claims at most five jobs, leases them for two minutes, and uses bounded provider calls. There is no email provider requirement.
7. Enable submissions, then test one consented staging inquiry, dashboard visibility/status change, CAPTCHA failure, duplicate retry, Telegram failure and recovery. Do not paste inquiry bodies or tokens into logs/chat. Re-run public/private REST authorization tests in the actual staging stack before public rollout.

Telegram contains only interest category, receipt reference and the fixed admin link. It excludes name, email, phone, organisation and message, and uses plain text with link previews disabled. Notifications are at least once: a provider success followed by a lost acknowledgement can produce a duplicate alert. Failures retry after five minutes; after ten attempts jobs remain stored for operator review, never deleting inquiries. Monitor undelivered jobs and run the worker regularly. Do not promise exactly-once delivery.

## Validation and remaining limits

Actual handler tests use injected HTTP transport to cover validation, CAPTCHA hostname/action, parameter-bound JSON payloads, failure responses and notification payload privacy. They do not contact Cloudflare, Telegram or production. The forward SQL is executed in disposable PGlite with real role grants and the repository's original admin helper. No local Docker/PostgREST or live bot delivery has been verified in this batch. Deployment and credentials remain required; the local preview correctly shows submission as not connected.

Roll back by disabling submissions and the worker, then reverting the client/server images. Keep the inquiry/outbox tables and records; do not drop them to roll back UI changes. Never undo unrelated security migrations.
## Completed local validation — 2026-11-10

- Landing: 9 automated tests passed (including actual server handler/worker execution with injected HTTP transport and real HTTP production-preview checks).
- Database: 5 tests passed using the actual forward migration in disposable PGlite, with real PostgreSQL permission checks and the repository admin helper.
- Existing application regressions: 58 tests passed across registration, license authorization, dashboard loading and visitor grouping.
- Landing and application TypeScript checks and production builds passed. The application build retains a warning about chunks above 500 kB; no performance improvement is claimed.
- Browser: desktop Diamond supporter popup, Escape dismissal/focus restoration, mobile Gold empty state, modal width inside the viewport, disabled unconfigured submission and reordered navigation verified.
- Not executed: real Supabase/PostgREST inquiry authorization tests, multi-connection inquiry concurrency tests, live Turnstile verification, live Telegram delivery and authenticated administrator inbox browser workflow. No production access, migration application, commit or deployment occurred.
