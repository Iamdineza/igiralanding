# Inquiry runtime connection

No source rebuild or database migration is needed for this configuration batch. It reuses the already installed server handlers and private inbox migration. Prepare script reads only the existing private staging, CAPTCHA and Telegram environment files. It creates new files exclusively and prints no secrets; it never restarts services or changes existing configuration.

## TLS route

The public API remains IP restricted. The proxy receives the network-scoped Docker DNS alias `api-staging.igiraprovisoire.rw`, so the landing server reaches Caddy directly over its dedicated network while validating the existing public TLS certificate normally. Only POST to the three named submission/outbox RPCs is admitted from that network; Supabase still verifies the service-role token. All prior app/API IP restrictions and the public home block are preserved. No PostgreSQL/Studio ports are published. Do not use insecure TLS flags or broaden public API access.

## Order

1. Run `prepare-inquiries.py --staging <existing staging directory> --landing <existing home release directory>`. It requires mode-600 `.env.staging`, `.env.security` and `.env.telegram` and exactly the landing/Caddy containers on the dedicated home ingress network. Existing output files cause a stop for review.
2. Add `-f compose.inquiries-proxy.yaml` last to the current `publichome` helper, retaining every previous overlay including Telegram. Validate Compose and Caddy, then recreate only `preview-proxy`.
3. For the landing project use both `deployment/home/compose.yaml` and `deployment/home/compose.inquiries.yaml`. Recreate only `landing`, without building. It receives private runtime secrets; inquiry submission remains disabled because the base Compose environment overrides it to false. Never render complete Compose configuration or container environments into chat/logs.
4. Feed `verify-inquiries.mjs` into `docker compose ... exec -T landing node --input-type=module`. Expected backend status is HTTP 400 / SQLSTATE 22023: deliberately invalid data proves the authenticated submission guard is reached without creating an inquiry. The worker check claims/processes any queued jobs; before public enablement the queue should be empty, producing processed=0, delivered=0. It does not print records or tokens. A schema-cache error may require a separate reviewed PostgREST refresh; do not reset the database.
5. Add `deployment/home/compose.inquiries-enabled.yaml` last to the landing helper only after the checks pass. Recreate `landing`. Configuration becomes enabled, and the existing form automatically removes its not-connected notice and loads the public CAPTCHA widget. No email provider is involved.
6. User submits one consented test inquiry through the real browser/CAPTCHA. Verify it in Admin → Partnership Inquiries, then invoke the notification worker with its private curl config and confirm a summary arrives. Keep contact details/message out of Telegram and logs.
7. After delivery verification, install the previously supplied systemd service/timer. Its curl config must be copied from the private `inquiry-worker.curl` generated in the landing root into `/etc/igira/inquiry-worker.curl`, owned by igiraadmin, mode 600. Never paste its contents. The timer supports delivery while the dashboard is closed. Review and install it explicitly; nothing here installs or starts systemd units.

The admin link intentionally targets the current staging admin until the main app root is migrated. Runtime secrets must never be Docker build arguments or NEXT_PUBLIC variables. `.env*` are excluded from the landing build context. Keep using both runtime/proxy overlays on later service recreations, or configuration can be lost.

Rollback: omit the enabled overlay and recreate landing to disable new submissions. Keep the private runtime overlay so outstanding notifications can still be delivered. Proxy rollback omits only `compose.inquiries-proxy.yaml`, restoring the original public-home Caddy mount. Never delete saved inquiries or queue rows as an application rollback.
