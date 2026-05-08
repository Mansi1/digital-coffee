import { sign } from 'hono/jwt'
import { app } from '../app.js'
import type { Role } from '../lib/permissions.js'

export async function getAuthCookie(role: Role = 'USER'): Promise<string> {
  if (role === 'NONE') {
    const token = await sign(
      {
        id: 'none-role-test-user',
        email: 'none@test.local',
        role: 'NONE',
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      },
      process.env.JWT_SECRET as string,
    )
    return `token=${token}`
  }

  const res = await app.request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: role === 'ADMIN' ? 'admin@devroots.de' : 'user@devroots.de',
      password: role === 'ADMIN' ? 'admin1234' : 'user1234',
    }),
  })
  return res.headers.get('set-cookie') as string
}
