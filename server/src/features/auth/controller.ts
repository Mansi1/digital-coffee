import type { Context } from 'hono'
import { AuthService } from './service.js'

export class AuthController {
  static async identify(c: Context) {
    const { employeeId, pin } = c.req.valid('json' as never)
    const employee = await AuthService.identifyEmployee(employeeId, pin)
    return c.json({ data: employee }, 200)
  }
}
