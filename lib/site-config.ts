function origin(value: string, label: string): string {
  const url = new URL(value)
  const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
  if ((url.protocol !== 'https:' && !(url.protocol === 'http:' && loopback)) ||
      url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error(`${label} must be an HTTPS origin (HTTP allowed only on loopback)`)
  }
  return url.origin
}

// Public build-time settings only. Never place server credentials here.
export const APP_ORIGIN = origin(process.env.NEXT_PUBLIC_APP_URL || 'https://igiraprovisoire.rw', 'Application URL')
export const SITE_ORIGIN = origin(process.env.NEXT_PUBLIC_SITE_URL || 'https://home.igiraprovisoire.rw', 'Landing URL')
