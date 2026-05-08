import type { Context } from 'hono'
import { deleteCookie, setCookie } from 'hono/cookie'
import { sign } from 'hono/jwt'
import { AdminAuthService } from './service.js'

const IS_PRODUCTION = process.env.NODE_ENV === 'production'

export class AdminAuthController {
  static async login(c: Context) {
    const { employeeId, pin } = c.req.valid('json' as never)
    const employee = await AdminAuthService.login(employeeId, pin)

    const token = await sign(
      {
        id: employee.id,
        email: employee.email,
        role: employee.role,
        companyId: employee.companyId,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
      },
      process.env.JWT_SECRET as string,
    )

    setCookie(c, 'token', token, {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: 'Strict',
      maxAge: 3600 * 8,
    })

    return c.json({ data: employee }, 200)
  }

  static async info(c: Context) {
    const user = c.get('user') as { id: string; email: string; role: string; companyId: string }
    return c.json({ data: { id: user.id, email: user.email, role: user.role, companyId: user.companyId } }, 200)
  }

  static async logout(c: Context) {
    deleteCookie(c, 'token')
    return c.json({ data: null }, 200)
  }
}
