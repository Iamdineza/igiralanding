"""Prepare private runtime settings and a restricted TLS backend route; start nothing."""
from pathlib import Path
import argparse
import hashlib
import ipaddress
import json
import os
import re
import secrets
import subprocess

RPCS = ('submit_partnership_inquiry','claim_partnership_notifications','finish_partnership_notification')

def render(original, subnet):
    network=ipaddress.ip_network(subnet,strict=True)
    if network.version!=4 or not network.is_private or network.prefixlen<16:
        raise ValueError('Unexpected dedicated Docker subnet')
    marker='api-staging.igiraprovisoire.rw {'
    if original.count(marker)!=1 or original.count('@approved remote_ip')!=2 or 'home.igiraprovisoire.rw {' not in original or '@inquiry_backend' in original:
        raise ValueError('Unexpected existing Caddy configuration; preserved')
    start=original.index(marker)
    insertion=original.index('    @approved remote_ip',start)
    paths=' '.join('/rest/v1/rpc/'+name for name in RPCS)
    block=f'''    @inquiry_backend {{
        remote_ip {network}
        method POST
        path {paths}
    }}
    handle @inquiry_backend {{
        reverse_proxy private-api:8080 {{
            header_up X-Forwarded-For {{remote_host}}
        }}
    }}
'''
    return original[:insertion]+block+original[insertion:]

def read_env(path):
    if path.stat().st_mode & 0o077:
        raise ValueError('Private environment file permissions must be 600')
    result={}
    for line in path.read_text(encoding='utf-8').splitlines():
        if not line or line.startswith('#'):continue
        key,value=line.split('=',1)
        if len(value)>=2 and value[0]==value[-1] and value[0] in ('"',"'"):value=value[1:-1]
        if '\r' in value or '\n' in value:raise ValueError('Invalid environment value')
        result[key]=value
    return result

def write_new(path,data,mode):
    fd=os.open(path,os.O_WRONLY|os.O_CREAT|os.O_EXCL,mode)
    with os.fdopen(fd,'w',encoding='utf-8',newline='\n') as f:f.write(data)
    path.chmod(mode)

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--staging',required=True)
    parser.add_argument('--landing',required=True)
    args=parser.parse_args()
    stage=Path(args.staging).expanduser().resolve(strict=True)
    landing=Path(args.landing).expanduser().resolve(strict=True)
    files={
        stage/'security-home-inquiries.Caddyfile':0o644,
        stage/'compose.inquiries-proxy.yaml':0o644,
        stage/'inquiries-proxy-baseline.json':0o600,
        landing/'.env.inquiries':0o600,
        landing/'deployment/home/compose.inquiries.yaml':0o644,
        landing/'deployment/home/compose.inquiries-enabled.yaml':0o644,
        landing/'inquiry-worker.curl':0o600,
    }
    if any(p.exists() for p in files):raise SystemExit('Existing inquiry configuration preserved; stopped')
    inspected=json.loads(subprocess.check_output(['sudo','docker','inspect','igira-nov9-staging-preview-proxy-1'],text=True))
    mounts=[m for m in inspected[0]['Mounts'] if m['Type']=='bind' and m['Destination']=='/etc/caddy/Caddyfile']
    if len(mounts)!=1:raise SystemExit('Unexpected Caddy mount')
    source=Path(mounts[0]['Source']).resolve(strict=True)
    if not source.is_relative_to(stage):raise SystemExit('Unexpected Caddy source location')
    network=json.loads(subprocess.check_output(['sudo','docker','network','inspect','igira-home-ingress'],text=True))[0]
    names={v['Name'] for v in network.get('Containers',{}).values()}
    if names!={'igira-home-landing-1','igira-nov9-staging-preview-proxy-1'}:raise SystemExit('Unexpected containers on home ingress network')
    subnets=[item['Subnet'] for item in network['IPAM']['Config'] if ':' not in item['Subnet']]
    if len(subnets)!=1:raise SystemExit('Unexpected ingress subnet configuration')
    candidate=render(source.read_text(encoding='utf-8'),subnets[0])
    settings=read_env(stage/'.env.staging')
    captcha=read_env(stage/'.env.security')
    telegram=read_env(stage/'.env.telegram')
    required=[settings.get('SERVICE_ROLE_KEY',''),captcha.get('VITE_TURNSTILE_SITE_KEY',''),captcha.get('TURNSTILE_SECRET_KEY',''),telegram.get('TELEGRAM_BOT_TOKEN',''),telegram.get('TELEGRAM_CHAT_ID','')]
    if not all(required) or any(re.search(r'\s',value) for value in required):raise SystemExit('Missing or invalid private configuration; no values displayed')
    worker_secret=secrets.token_hex(32)
    environment={
        'INQUIRIES_ENABLED':'false',
        'SUPABASE_SERVER_URL':'https://api-staging.igiraprovisoire.rw',
        'SUPABASE_SERVICE_ROLE_KEY':settings['SERVICE_ROLE_KEY'],
        'TURNSTILE_SITE_KEY':captcha['VITE_TURNSTILE_SITE_KEY'],
        'TURNSTILE_SECRET_KEY':captcha['TURNSTILE_SECRET_KEY'],
        'INQUIRY_ALLOWED_ORIGIN':'https://home.igiraprovisoire.rw',
        'INQUIRY_RATE_SECRET':secrets.token_hex(32),
        'INQUIRY_WORKER_SECRET':worker_secret,
        'TELEGRAM_BOT_TOKEN':telegram['TELEGRAM_BOT_TOKEN'],
        'TELEGRAM_CHAT_ID':telegram['TELEGRAM_CHAT_ID'],
        'INQUIRY_ADMIN_URL':'https://staging.igiraprovisoire.rw/admin',
    }
    proxy='''services:
  preview-proxy:
    volumes:
      - ./security-home-inquiries.Caddyfile:/etc/caddy/Caddyfile:ro
    networks:
      home-ingress:
        aliases:
          - api-staging.igiraprovisoire.rw
'''
    landing_overlay='''services:
  landing:
    env_file:
      - ../../.env.inquiries
'''
    enabled='''services:
  landing:
    environment:
      INQUIRIES_ENABLED: 'true'
'''
    curl=f'''url = "https://home.igiraprovisoire.rw/api/inquiries/notifications"
request = "POST"
header = "Authorization: Bearer {worker_secret}"
connect-timeout = 5
max-time = 100
proto = "=https"
'''
    values=[candidate,proxy,json.dumps({'source':str(source),'sha256':hashlib.sha256(source.read_bytes()).hexdigest()},indent=2)+'\n',''.join(f'{k}={v}\n' for k,v in environment.items()),landing_overlay,enabled,curl]
    os.umask(0o077)
    for (path,mode),value in zip(files.items(),values):write_new(path,value,mode)
    print('Private inquiry configuration prepared. Existing credentials reused without displaying values.')
    print('Submission remains disabled. No services restarted and no database changes made.')

if __name__=='__main__':
    try:main()
    except (ValueError,KeyError,OSError,subprocess.SubprocessError):
        raise SystemExit('Preparation failed; no private values displayed. Review configuration paths, permissions and Docker access.')
