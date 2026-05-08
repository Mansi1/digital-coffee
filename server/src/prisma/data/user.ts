import { hash } from 'argon2'
import type { PrismaClient } from '../../generated/prisma/client.js'

export async function seedUser(prisma: PrismaClient) {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@devroots.de' },
    update: {},
    create: {
      email: 'admin@devroots.de',
      passwort: await hash('admin1234'),
      role: 'ADMIN',
    },
  })

  const user = await prisma.user.upsert({
    where: { email: 'user@devroots.de' },
    update: {},
    create: {
      email: 'user@devroots.de',
      passwort: await hash('user1234'),
    },
  })

  return { admin, user }
}
