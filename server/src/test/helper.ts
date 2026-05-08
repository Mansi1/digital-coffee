import { sign } from 'hono/jwt'
import { prisma } from '../lib/prisma.js'

export async function getAdminCookie(): Promise<string> {
  const admin = await prisma.employee.findFirst({ where: { role: 'ADMIN' } })
  if (!admin) throw new Error('No admin employee found in test DB')

  const token = await sign(
    {
      id: admin.id,
      email: admin.email,
      role: admin.role,
      companyId: admin.companyId,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    process.env.JWT_SECRET as string,
  )
  return `token=${token}`
}
