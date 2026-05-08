import type { Context, Next } from 'hono'

export async function requireAuth(c: Context, next: Next) {
  const user = c.get('user')

  if (!user) {
    return c.json({ error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, 401)
  }

  await next()
}
