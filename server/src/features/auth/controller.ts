import type { Context } from 'hono'
import { setCookie } from 'hono/cookie'
import { sign } from 'hono/jwt'
import { AuthService } from './service.js'

const JWT_SECRET = process.env.JWT_SECRET as string
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export class AuthController {
  static async register(c: Context) {
    const { email, password } = c.req.valid('json' as never)
    const user = await AuthService.register(email, password)
    return c.json({ data: user }, 201)
  }

  static async login(c: Context) {
    const { email, password } = c.req.valid('json' as never)
    const user = await AuthService.login(email, password)

    const token = await sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 1d
      },
      JWT_SECRET,
    )

    setCookie(c, 'token', token, {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: 'Strict',
      maxAge: 3600 * 24,
    })

    return c.json({ data: { id: user.id, email: user.email, role: user.role } }, 200)
  }

  static async logout(c: Context) {
    setCookie(c, 'token', '', {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: 'Strict',
      maxAge: 0,
    })

    return c.json({ message: 'Logged out successfully' }, 200)
  }

  static async me(c: Context) {
    const user = c.get('user')
    return c.json({ user: { id: user.id, email: user.email, role: user.role } }, 200)
  }
}
