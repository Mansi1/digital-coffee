import { HTTPException } from 'hono/http-exception'
import { prisma } from '../../lib/prisma.js'
import { handlePrismaError } from '../../lib/prisma-error.js'

export type Todo = {
  id: string
  title: string
  isCompleted: boolean
  createdAt: string
}

export class TodosService {
  static async findAll(userId: string) {
    return await prisma.todo.findMany({
      where: {
        userId,
      },
    })
  }

  static async create(title: string, userId: string) {
    return await prisma.todo.create({
      data: {
        title,
        userId,
      },
    })
  }

  static async findById(id: number, userId: string) {
    const todo = await prisma.todo.findFirst({
      where: {
        id,
        userId,
      },
    })

    if (!todo) {
      throw new HTTPException(404, { message: 'Todo not found' })
    }

    return todo
  }

  static async update(
    id: number,
    data: Partial<Pick<Todo, 'title' | 'isCompleted'>>,
    userId: string,
  ) {
    try {
      return await prisma.todo.update({
        where: {
          id,
          userId,
        },
        data,
      })
    } catch (err) {
      handlePrismaError(err)
    }
  }

  static async delete(id: number, userId: string): Promise<void> {
    try {
      await prisma.todo.delete({
        where: {
          id,
          userId,
        },
      })
    } catch (err) {
      handlePrismaError(err)
    }
  }
}
