# Public home preview — no database exposure

This release contains the current creator page, favicon and sponsorship improvements. It runs independently from the working React application and has no database credentials. Inquiries remain visibly disabled until the separate inbox/CAPTCHA/worker rollout is complete.

The landing service publishes no host ports. A dedicated `igira-home-ingress` network connects only the landing service and the existing Caddy proxy. The new Caddy host is open to everyone; the original staging/API host blocks and IP restrictions are copied verbatim. An `X-Robots-Tag: noindex` header keeps this public preview out of search indexing until launch review. It is publicly accessible, not confidential; noindex is not authentication.

## Sequence

1. Verify the archive and `SHA256SUMS`, extract into a new directory, preserving earlier review packages.
2. Run `sudo docker compose -f deployment/home/compose.yaml -p igira-home config --quiet`, then `sudo docker compose -f deployment/home/compose.yaml -p igira-home up -d --build --wait --wait-timeout 180 landing` from the extracted release root. Image build time is additional to the health wait. This creates only the new landing container/network; it does not restart the application or database.
3. Run `python3 deployment/home/prepare-proxy.py --staging "$HOME/igira-nov9-auth-staging/deployment/nov9-staging"`. This reads the active mounted Caddy configuration and creates new files, refusing an existing home host or unexpected staging restrictions. It does not overwrite the active file or restart anything.
4. Add `-f compose.home-proxy.yaml` last in the existing staging Compose helper, after the MFA overlay. Keep every previous overlay and both private env files. The new overlay preserves Caddy certificate volumes, existing 80/443 bindings, and existing networks. Do not start a second proxy on these ports.
5. Validate `config --quiet` and run the existing proxy image with `caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile` using `--profile preview run --rm --no-deps preview-proxy`. Validate before recreating only `preview-proxy`. Do not run `up` for the whole backend stack.
6. Recreate only `preview-proxy` through the combined configuration. Caddy obtains TLS for home once public DNS resolves to the VPS and ports 80/443 are reachable. Test `https://home.igiraprovisoire.rw/healthz`, `/creator`, `/sponsors`, favicons and the main application links. Test from an ordinary second network to confirm public availability. Check staging and api-staging are still restricted from that network; authorized clients remain allowed by their existing IP rules.

## Rollback

Recreate `preview-proxy` with the previous Compose helper omitting only `compose.home-proxy.yaml`. The prior Caddy configuration was never edited. This removes the home route while preserving the application. Stop the new landing container separately if needed; do not remove database/storage volumes or run project-wide `down -v`. Keep using the home overlay on subsequent proxy operations once it is accepted.

## Limits

Docker/Caddy validation and certificate issuance must run on the VPS; they have not been executed on Windows. No public domain availability is claimed before those checks pass. This prepares deployment with the current Caddy setup; moving ingress into Coolify remains a separate reviewed task because both need ports 80/443. The public landing runs Next.js server routes, rather than a purely static export, to support the later private inquiry submission endpoint. Only enable that endpoint after its separate security and delivery verification.
