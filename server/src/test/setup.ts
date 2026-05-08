import { prisma } from '../lib/prisma.js'
import { seedTodo } from '../prisma/data/todo.js'
import { seedUser } from '../prisma/data/user.js'

beforeAll(async () => {
  await seedUser(prisma)
  await seedTodo(prisma)
})

afterAll(async () => {
  await prisma.todo.deleteMany()
  await prisma.user.deleteMany()
  await prisma.$disconnect()
})
