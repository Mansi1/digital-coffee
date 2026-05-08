import { verify } from 'argon2'
import { HTTPException } from 'hono/http-exception'
import { prisma } from '../../../lib/prisma.js'

export class AdminAuthService {
  static async login(employeeId: string, pin: string) {
    const employee = await prisma.employee.findUnique({ where: { id: employeeId } })

    if (!employee) throw new HTTPException(401, { message: 'Invalid credentials' })

    const valid = await verify(employee.pin, pin)
    if (!valid) throw new HTTPException(401, { message: 'Invalid credentials' })

    if (employee.role !== 'ADMIN') throw new HTTPException(403, { message: 'Admin role required' })

    return { id: employee.id, email: employee.email, role: employee.role, companyId: employee.companyId }
  }
}
