import { networkInterfaces } from 'node:os'
import { isIP } from 'node:net'
import { existsSync, cpSync, mkdirSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const args = process.argv.slice(2)
if (args.length !== 2 || args[0] !== '--host') throw Error('Use: node deployment/preview-lan.mjs --host YOUR_WIFI_IPV4')
const host = args[1]
const local = Object.values(networkInterfaces()).flat().some(entry => entry?.family === 'IPv4' && entry.address === host && !entry.internal)
const privateAddress = /^192\.168\./.test(host) || /^10\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host)
if (isIP(host) !== 4 || !privateAddress || !local) throw Error('Choose a private IPv4 address assigned to this computer; no public or wildcard binding')
const output = path.join(root, '.next', 'standalone')
if (!existsSync(path.join(output, 'server.js'))) throw Error('Run the production build first')
mkdirSync(path.join(output, 'public'), { recursive: true })
mkdirSync(path.join(output, '.next', 'static'), { recursive: true })
cpSync(path.join(root, 'public'), path.join(output, 'public'), { recursive: true })
cpSync(path.join(root, '.next', 'static'), path.join(output, '.next', 'static'), { recursive: true })
console.log(`Production landing preview: http://${host}:3015 (binds only to this address)`)
const child = spawn(process.execPath, [path.join(output, 'server.js')], {
  cwd: output, stdio: 'inherit',
  env: { ...process.env, HOSTNAME: host, PORT: '3015', NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1' },
})
child.on('error', error => { console.error(error.message); process.exitCode = 1 })
child.on('exit', code => { process.exitCode = code || 0 })
process.on('SIGINT', () => child.kill('SIGINT'))
process.on('SIGTERM', () => child.kill('SIGTERM'))
