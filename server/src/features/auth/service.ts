import { hash, verify } from 'argon2'
import { HTTPException } from 'hono/http-exception'
import { prisma } from '../../lib/prisma.js'
import { handlePrismaError } from '../../lib/prisma-error.js'

export class AuthService {
  public static async register(email: string, password: string) {
    const existing = await prisma.user.findFirst({ where: { email } })
    if (existing) {
      throw new HTTPException(409, { message: 'User already exists' })
    }

    const hashedPassword = await hash(password)

    const user = await prisma.user
      .create({
        data: { email, passwort: hashedPassword },
      })
      .catch(handlePrismaError)

    return { id: user.id, email: user.email, role: user.role }
  }

  public static async login(email: string, password: string) {
    const user = await prisma.user.findFirst({ where: { email } }).catch(handlePrismaError)

    if (!user) {
      throw new HTTPException(401, { message: 'Invalid credentials' })
    }

    const valid = await verify(user.passwort, password)
    if (!valid) {
      throw new HTTPException(401, { message: 'Invalid credentials' })
    }

    return { id: user.id, email: user.email, role: user.role }
  }
}
