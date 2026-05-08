import type { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'
import { verify } from 'hono/jwt'

export async function jwtAuth(c: Context, next: Next) {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET environment variable is not set')

  const token = getCookie(c, 'token')
  if (token) {
    try {
      const payload = await verify(token, secret)
      c.set('user', payload)
    } catch (err) {
      console.warn('Invalid JWT token received:', (err as Error).message)
    }
  }
  await next()
}
