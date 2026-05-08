import { hash } from 'argon2'
import { prisma } from '../lib/prisma.js'

beforeAll(async () => {
  await prisma.order.deleteMany()
  await prisma.employee.deleteMany()
  await prisma.product.deleteMany()
  await prisma.company.deleteMany()

  const company = await prisma.company.create({
    data: { name: 'Test GmbH', email: 'test@company.com' },
  })

  await prisma.employee.createMany({
    data: [
      {
        name: 'Test Admin',
        email: 'admin@test.com',
        pin: await hash('12345'),
        role: 'ADMIN',
        companyId: company.id,
      },
      {
        name: 'Test User',
        email: 'user@test.com',
        pin: await hash('12345'),
        role: 'USER',
        companyId: company.id,
      },
    ],
  })

  await prisma.product.createMany({
    data: [
      { name: 'Espresso', price: 0.5 },
      { name: 'Cappuccino', price: 0.8 },
      { name: 'Latte Macchiato', price: 1.2 },
      { name: 'Kaffee', price: 0.5 },
    ],
  })
})

afterAll(async () => {
  await prisma.order.deleteMany()
  await prisma.employee.deleteMany()
  await prisma.product.deleteMany()
  await prisma.company.deleteMany()
  await prisma.$disconnect()
})
