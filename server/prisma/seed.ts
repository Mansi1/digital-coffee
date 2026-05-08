import { prisma } from '../src/lib/prisma.js'
import { seedTodo } from './data/todo.js'
import { seedUser } from './data/user.js'

async function main() {
  // Delete existing data
  await prisma.todo.deleteMany()
  await prisma.user.deleteMany()

  // Seed new data
  const { admin, user } = await seedUser(prisma)
  const { adminTodos, userTodos } = await seedTodo(prisma)
  console.log('Seeded:', { admin, user, adminTodos, userTodos })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
