const explicitOrigins = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

/** Without CORS_ORIGINS (local dev), any localhost origin is trusted. */
function isAllowed(origin: string): boolean {
  if (explicitOrigins.length > 0) return explicitOrigins.includes(origin)
  return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
}

/** Credentialed CORS for the web app (and later the Electron shell) — echoes
 *  the origin back instead of `*` so cookies are allowed to flow. */
export default defineEventHandler((event) => {
  const origin = getHeader(event, 'origin')
  if (!origin || !isAllowed(origin)) return

  setResponseHeaders(event, {
    'access-control-allow-origin': origin,
    'access-control-allow-credentials': 'true',
    vary: 'Origin',
  })

  if (event.method === 'OPTIONS') {
    setResponseHeaders(event, {
      'access-control-allow-methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
      'access-control-allow-headers':
        getHeader(event, 'access-control-request-headers') ?? 'content-type',
      'access-control-max-age': '86400',
    })
    setResponseStatus(event, 204)
    return ''
  }
})
