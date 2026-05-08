import type { PrismaClient } from '../../generated/prisma/client.js'

export async function seedTodo(prisma: PrismaClient) {
  const admin = await prisma.user.findFirst({
    where: { email: 'admin@devroots.de' },
  })

  const user = await prisma.user.findFirst({
    where: { email: 'user@devroots.de' },
  })

  if (!admin || !user) {
    throw new Error('Users not found. Run seedUser first.')
  }

  const adminTodos = await prisma.todo.createMany({
    skipDuplicates: true,
    data: [
      {
        title: 'Benutzerrollen und Berechtigungen konfigurieren',
        isCompleted: true,
        userId: admin.id,
      },
      { title: 'Datenbank-Backups einrichten', isCompleted: true, userId: admin.id },
      { title: 'API-Rate-Limiting implementieren', isCompleted: false, userId: admin.id },
      { title: 'Server-Monitoring einrichten', isCompleted: false, userId: admin.id },
      { title: 'Sicherheits-Audit durchführen', isCompleted: false, userId: admin.id },
    ],
  })

  const userTodos = await prisma.todo.createMany({
    skipDuplicates: true,
    data: [
      { title: 'Profil vervollständigen', isCompleted: false, userId: user.id },
      { title: 'Erste Aufgabe erstellen', isCompleted: false, userId: user.id },
      { title: 'Benachrichtigungen einrichten', isCompleted: false, userId: user.id },
      { title: 'Passwort ändern', isCompleted: false, userId: user.id },
      { title: 'Dashboard erkunden', isCompleted: false, userId: user.id },
    ],
  })

  return { adminTodos, userTodos }
}
