# Landing page hosting and first improvement batch

Source: `Iamdineza/igiralanding`, cloned at `16010902c1f72d361daa3f5cfc748384006715ee`.
Local branch: `codex/landing-hosting-readiness`. No commits, pushes, DNS changes or deployments.

## Igira-branded remake (current version)

The user's BK reference prompted a fresh homepage, now `components/brand-landing-page.tsx` with `app/brand.css`. It reuses the application's navy (#0b2b50), primary yellow (hsl 45 98% 51%), Igira logo and copied checkered footer asset. A road-photo hero, learning shortcuts, interactive product modes, language previews, article filtering/search, hosting support and FAQs replace the previous sparse design. No BK images, branding or code were copied.

`components/brand-navbar.tsx` supplies consistent navigation for the homepage, blog, articles and sponsorship pages. Earlier homepage source is preserved, but no longer rendered. Desktop/mobile visual checks, mobile menu, product modes, language preview, FAQ interaction and empty/restored article search were exercised locally. No backend or notification changes were included in this design batch.

## Updated domain decision and design

The user subsequently chose to keep the existing web app on the main domain. That decision supersedes the original split below: the main app remains at `igiraprovisoire.rw`, and the landing page moves to `about.igiraprovisoire.rw`. Defaults, example environment and Docker build arguments now follow that decision. Do not move existing authentication sessions to an app subdomain.

The new homepage is `components/premium-landing-page.tsx`, styled by `app/premium.css`; `app/page.tsx` now uses it. Product preview controls, mobile navigation, no-result blog search and restoration were checked in the local browser at desktop and mobile sizes. `docs/INQUIRIES-AND-CONTENT-PLAN.md` records the still-unimplemented backend requirements. The current form remains an email draft until that backend batch is implemented and reviewed.

## Architecture and compatibility

This is a Next.js App Router website with React 19, Tailwind 4 and Framer Motion. `app/page.tsx` renders the premium homepage and reuses navigation/footer/blog components; `/blog`, four generated article routes and `/sponsors` are present. Content and assets are local (`lib/blog-data.ts`, `lib/sponsor-data.ts`, `lib/landing-assets.ts`, `public/`). No Supabase client, database, authentication implementation or application backend integration was found in this checkout. It can be hosted separately from the React/Vite application.

Original proposed routing (superseded by the decision above):

| Hostname | Deployment |
| --- | --- |
| igiraprovisoire.rw | This landing page |
| www.igiraprovisoire.rw | Redirect to landing page |
| app.igiraprovisoire.rw | Existing Igira application |
| api.igiraprovisoire.rw | Existing Supabase API |

One IPv4 address is sufficient. Only the reverse proxy needs public ports 80/443; route by hostname. Keep database, Studio and application container ports private. Do not bind a second reverse proxy to the ports already used by staging Caddy. Coolify migration remains a separate planned ingress change.

## Confirmed baseline findings and fixes

- `next.config.mjs` ignored TypeScript errors. Baseline `tsc --noEmit` found three errors: an impossible category comparison, accessing `composed` on union members without that field, and language state inferred as English-only. These are corrected, and builds now enforce types.
- `components/landing-page.tsx` and `app/blog/[slug]/page.tsx` linked application calls to action to `www.igiraprovisoire.rw`. When that host becomes the landing page, they would loop users back to it. `lib/site-config.ts` now supplies validated public build-time app/site origins, defaulting to the proposed split. HTTPS is required except for loopback development; embedded credentials, paths, queries and fragments are rejected.
- The footer used `#` for legal links and local section fragments even on blog/sponsor pages. It now links to actual application `/privacy` and `/terms` routes (verified in the application checkout) and root-page sections.
- `components/sponsor-components.tsx` had a form with no action or submission handler. Native default GET submission could put contact details in the page URL without delivering an inquiry. The form now prepares an encoded email draft to the user-approved `info@igiraprovisoire.rw`, with clear review/send instructions and a direct email fallback. It does not claim delivery or automatically send mail. Fixed recipients and encoded body prevent user input adding mailto query fields. `method="post"` avoids a default GET query if JavaScript is unavailable; without JavaScript, use the direct email link. Field lengths are bounded.
- `app/layout.tsx` loaded Vercel Analytics on every production build. Analytics is now explicitly opt-in, so self-hosting does not silently retain that request. This is not a general third-party-free site: Google Translate, Iconify and testimonial image hosts remain external dependencies.
- Baseline `pnpm audit` reported six critical, 35 high, 39 moderate and seven low advisory entries. Next was pinned at 16.3.0; advisory patched ranges required a newer 16 release. Updated Next to 16.4.6 and other dependencies within their major versions, including the existing Hono override. Final audit reports zero critical/high, one moderate and one low. Advisory presence is not proof every vulnerable feature was reachable in this website; image optimization was already disabled.
- Global pnpm 11 ignored the old package.json override setting. The project now pins pnpm 10.34.9, which understands its existing lockfile/overrides, and Node 22.12–24. Use the pinned package manager rather than ignoring warnings.
- The old lint script referenced ESLint without any installed ESLint/configuration. It was replaced by an explicit `typecheck` script; no claim is made that TypeScript is a complete linter.
- `next.config.mjs` enables standalone output, disables the framework branding header and sets basic security headers. The Dockerfile uses a non-root runtime and copies only standalone output/assets. `app/healthz/route.ts` exposes a minimal, uncached health response.
- `app/globals.css` adds visible keyboard focus for interactive elements against light and dark backgrounds. Existing layout and visual styling are otherwise retained. This is not a complete rendered accessibility audit.

## Local use

Use Node 22.12+ (or Node 24) and the pinned manager:

```powershell
npm exec --yes --package=pnpm@10.34.9 -- pnpm install --frozen-lockfile --ignore-scripts
npm exec --yes --package=pnpm@10.34.9 -- pnpm typecheck
npm exec --yes --package=pnpm@10.34.9 -- pnpm test
npm exec --yes --package=pnpm@10.34.9 -- pnpm dev --hostname 127.0.0.1 --port 3011
```

Copy `.env.example` to `.env.local` if overriding public origins. For application integration testing, use `NEXT_PUBLIC_APP_URL=https://staging.igiraprovisoire.rw`. Public Next variables are compiled into browser assets: changing them requires rebuilding. No Supabase keys or server/mail credentials are needed here.

## Isolated Docker/Coolify preparation

The Dockerfile follows Next's standalone output model. The optional `compose.preview.yaml` binds **only 127.0.0.1:18081**, with a separate Compose project and no database connections. Default application links point to the existing staging application. Nothing has been run on the VPS by this batch.

```bash
docker compose -f compose.preview.yaml config --quiet
docker compose -f compose.preview.yaml build
docker compose -f compose.preview.yaml up -d --wait
curl --fail --max-time 5 http://127.0.0.1:18081/healthz
```

Do not run these from the existing application deployment folder. Review and transfer a landing-only source package into a new folder. Docker installation/build/runtime are unverified on this Windows environment. Source packages must exclude Git history, local environment files, node_modules and build outputs.

In Coolify, use a separate application with this repository/Dockerfile, internal port 3000 and `/healthz`. Configure the public URL build arguments; start with a protected preview hostname. Keep the Next container on the reverse proxy's network, outside the Supabase database network. GitHub automatic deployment should target only a reviewed branch after an explicitly approved commit/push. Use image tags based on commit SHA and retain the preceding image for rollback. Application logs are stdout/stderr; preview Compose rotates Docker logs. No database rollback is involved in landing-page releases.

Before final DNS changes, update the main application's public URL, Google OAuth origins/redirect allowlist and Turnstile hostname configuration for `app.igiraprovisoire.rw`. Merely deploying this landing page does not perform that migration. Preserve existing Lovable/staging settings during transition.

## Validation

Baseline build passed only because type errors were ignored. Updated typecheck and optimized production build pass with type validation enabled. Actual HTTP checks run against the standalone production server on loopback cover home, blog, article, sponsors, 404, health, security headers, app/legal links and the email-draft form. Additional tests exercise the actual origin validator and mailto generation with malicious query text and oversize/missing fields.

Final result: four tests passed, zero failures/skips with `LANDING_TEST_URL=http://127.0.0.1:3011`; TypeScript, production build and `git diff --check` passed. Without that test URL, the HTTP integration test deliberately skips. The standalone preview is bound to loopback only.

Audit results are package advisory counts, not penetration testing. Remaining findings are moderate minimatch in a tooling dependency and low deepmerge with no patched version advertised. No forced cross-major override was introduced to hide them.

## Remaining review before launch

- Verify that `info@igiraprovisoire.rw` receives mail and manually test an email draft on desktop/mobile. Mailto depends on the visitor having an email app; a direct address is shown as fallback. A reliable server-delivered form would require a separate approved backend, abuse controls and mail delivery setup.
- Test Docker on Ubuntu and review actual desktop/mobile renders and keyboard navigation. HTTP checks do not replace browser interaction/visual QA.
- Large source PNGs include 2–3 MB screenshots/blog images. No loading-speed improvement is claimed. Measure LCP and transfer sizes before choosing resizing/format changes.
- Review authenticity/permission for testimonials, external profile photographs, sponsorship claims and blog article content (article bodies currently share generic text). Verify store/download buttons point to real releases before advertising availability.
- Blog footer links include category queries, while `BlogIndexGrid` currently initializes to All rather than consuming the query parameter. That preexisting behavior remains for a later functional batch.
- Google Translate and Iconify/testimonial hosts remain external. A strict CSP must be tested with their scripts and Next hydration before enforcement; this batch does not claim a complete CSP or third-party privacy review.
- The initial `next/font/google` build downloads fonts. Fonts are served from the build afterward, but fully network-independent builds would require vendoring a reviewed licensed font.
- Finish the main application's backup/restore, security runtime checks and final-domain cutover plan independently. This landing checkout does not modify application data or its uncommitted changes.

References: [Next deployment](https://nextjs.org/docs/app/getting-started/deploying), [standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output), [pnpm settings](https://pnpm.io/settings).
