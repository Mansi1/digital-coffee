import type { Context } from 'hono'

import { TodosService } from './service.js'

export class TodosController {
  static async getAll(c: Context) {
    const userId = c.get('user').id as string
    const todos = await TodosService.findAll(userId)
    return c.json({ data: todos })
  }

  static async getById(c: Context) {
    const id = Number(c.req.param('id'))
    const userId = c.get('user').id as string
    const todo = await TodosService.findById(id, userId)
    return c.json({ data: todo })
  }

  static async create(c: Context) {
    const { title } = await c.req.json<{ title: string }>()
    const userId = c.get('user').id as string
    const todo = await TodosService.create(title, userId)
    return c.json({ data: todo }, 201)
  }

  static async update(c: Context) {
    const id = Number(c.req.param('id'))
    const userId = c.get('user').id as string
    const body = await c.req.json<{ title?: string; completed?: boolean }>()
    const todo = await TodosService.update(id, body, userId)
    return c.json({ data: todo })
  }

  static async delete(c: Context) {
    const id = Number(c.req.param('id'))
    const userId = c.get('user').id as string
    await TodosService.delete(id, userId)
    return c.json({ message: 'Todo deleted' }, 200)
  }
}
