# Local-network mobile preview

The production preview is bound only to the computer's current Wi-Fi address:

`http://192.168.1.55:3015`

Use a phone/tablet connected to the same Wi-Fi. The local development preview at `127.0.0.1:3012` is still separate. The phone URL serves a fixed production build; source edits require a new build/restart.

## Firewall access

The Codex terminal is not elevated, so it did not add a Windows Firewall rule. If the phone cannot connect, open **PowerShell as Administrator** and run:

```powershell
& 'E:\Monster HD\igira-landing-review\deployment\enable-lan-preview.ps1' -HostAddress '192.168.1.55'
```

The helper validates that this address belongs to Wi-Fi on a private 192.168.x.0/24 subnet, then permits only TCP 3015, the Node executable, the Wi-Fi interface, this local IP and that local subnet. The current network is classified Public, so the rule covers profiles without changing the network's category. It refuses to overwrite an existing named rule. This is local-network access, not Internet/router exposure.

After testing, the exact rule can be removed from an administrator terminal:

```powershell
Remove-NetFirewallRule -Name IgiraLandingPreview3015
```

If access still fails after the rule is installed, check that both devices use the same network, that a VPN is not changing routing, and that the access point permits communication between Wi-Fi clients. The assistant has verified HTTP responses from this computer, not a physical phone connection.

## Restart after further changes

Stop the old production preview before rebuilding: Windows can lock `.next/standalone` while its server runs. Use Ctrl+C in its terminal (or ask the active Codex session to stop its managed preview).

```powershell
Set-Location 'E:\Monster HD\igira-landing-review'
npm exec --yes --package=pnpm@10.34.9 -- pnpm build
node deployment/preview-lan.mjs --host 192.168.1.55
```

The helper validates the address against local network interfaces, rejects public/wildcard bindings, copies public/static assets into generated standalone output and runs the production server on port 3015. Recheck the Wi-Fi IP if it changes. Keep the computer awake while testing.

## Validation for this batch

- TypeScript, production build, Node helper syntax and `git diff --check` passed.
- Four tests passed with no skips using `LANDING_TEST_URL=http://192.168.1.55:3015` and `LANDING_ALLOW_PRIVATE_NETWORK=true`, including actual HTTP requests and presence of all six navigation links across pages.
- Browser checks covered restored desktop/mobile navigation, blog filtering from footer query links, article navigation, sponsorship styling and mobile layout without horizontal overflow.
- Hero glass and Sokrab credit are implemented; hero/product/FAQ motion uses Framer Motion with reduced-motion handling.
- Windows Firewall modification, physical-phone access and reduced-motion OS preference switching were not executed by the assistant.
- Translation and the database/inquiry notification backend remain separate work. No commit, push, VPS deployment or database change was performed.
