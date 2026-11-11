"""Create a separate Caddy overlay; preserve current configuration and services."""
from pathlib import Path
import argparse
import hashlib
import json
import os
import subprocess

HOST = 'home.igiraprovisoire.rw'

def render(original):
    if HOST in original:
        raise ValueError('Home hostname already configured; review the existing configuration first')
    if not all(value in original for value in ('staging.igiraprovisoire.rw', 'api-staging.igiraprovisoire.rw')) or original.count('@approved remote_ip') != 2:
        raise ValueError('Unexpected staging restrictions; current configuration preserved')
    return original.rstrip() + '''

home.igiraprovisoire.rw {
    header {
        X-Content-Type-Options nosniff
        Referrer-Policy strict-origin-when-cross-origin
        X-Robots-Tag "noindex, nofollow, noarchive"
        -Server
    }
    request_body {
        max_size 16KB
    }
    reverse_proxy igira-home-web:3000
}
'''

OVERLAY = '''# Append after the current security and MFA overlays.
services:
  preview-proxy:
    restart: unless-stopped
    volumes:
      - ./security-home.Caddyfile:/etc/caddy/Caddyfile:ro
    networks:
      home-ingress: {}
networks:
  home-ingress:
    external: true
    name: igira-home-ingress
'''

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--staging', required=True)
    args = parser.parse_args()
    staging = Path(args.staging).expanduser().resolve(strict=True)
    outputs = [staging / name for name in ('security-home.Caddyfile','compose.home-proxy.yaml','home-proxy-baseline.json')]
    if any(p.exists() for p in outputs):
        raise SystemExit('Home overlay output already exists; stopped without overwriting')
    inspected = json.loads(subprocess.check_output(['sudo','docker','inspect','igira-nov9-staging-preview-proxy-1'],text=True))
    mounts = [m for m in inspected[0]['Mounts'] if m['Destination']=='/etc/caddy/Caddyfile' and m['Type']=='bind']
    if len(mounts)!=1:
        raise SystemExit('Expected one mounted Caddy configuration')
    source = Path(mounts[0]['Source']).resolve(strict=True)
    if not source.is_relative_to(staging):
        raise SystemExit('Mounted Caddy source is outside the expected staging directory')
    original = source.read_text(encoding='utf-8')
    updated = render(original)
    os.umask(0o077)
    for path,data,mode in [(outputs[0],updated,0o644),(outputs[1],OVERLAY,0o644),(outputs[2],json.dumps({'source':str(source),'sha256':hashlib.sha256(source.read_bytes()).hexdigest()},indent=2)+'\n',0o600)]:
        with path.open('x',encoding='utf-8',newline='\n') as f:
            f.write(data)
        path.chmod(mode)
    print('Separate public-home overlay prepared. Existing Caddy configuration unchanged.')
    print('No services restarted, no secrets read, no database changes made.')

if __name__=='__main__':
    main()
