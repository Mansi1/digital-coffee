import type { Context, Next } from 'hono'
import type { Role } from '../lib/permissions.js'

export function requireRole(role: Role) {
  return async (c: Context, next: Next) => {
    const user = c.get('user') as { role: Role } | undefined

    if (!user) {
      return c.json({ error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } }, 401)
    }

    if (user.role !== role) {
      return c.json({ error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } }, 403)
    }

    await next()
  }
}
