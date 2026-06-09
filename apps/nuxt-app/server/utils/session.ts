import { SignJWT, jwtVerify } from 'jose'
import type { H3Event } from 'h3'
import { getCookie, setCookie, deleteCookie } from 'h3'

const SESSION_COOKIE = 'session'
const SECRET = new TextEncoder().encode(process.env.SESSION_SECRET ?? 'dev-only-insecure-secret-change-me')

export interface SessionPayload {
  userId: number
  email: string
}

export async function createSessionCookie(event: H3Event, payload: SessionPayload) {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(SECRET)

  setCookie(event, SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })
}

export function clearSessionCookie(event: H3Event) {
  deleteCookie(event, SESSION_COOKIE, { path: '/' })
}

export async function getAuthSession(event: H3Event): Promise<SessionPayload | null> {
  const token = getCookie(event, SESSION_COOKIE)
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, SECRET)
    if (typeof payload.userId !== 'number' || typeof payload.email !== 'string') return null
    return { userId: payload.userId, email: payload.email }
  } catch {
    return null
  }
}
