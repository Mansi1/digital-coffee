import type { Context } from 'hono'
import { AdminProductService } from './service.js'

const toResponse = (p: { id: string; name: string; price: number; isActive: boolean; createdAt: Date; updatedAt: Date }) => ({
  id: p.id,
  name: p.name,
  price: p.price,
  isActive: p.isActive,
  createdAt: p.createdAt.toISOString(),
  updatedAt: p.updatedAt.toISOString(),
})

export class AdminProductController {
  static async getAll(c: Context) {
    const products = await AdminProductService.getAll()
    return c.json({ data: products.map(toResponse) }, 200)
  }

  static async create(c: Context) {
    const body = c.req.valid('json' as never)
    const product = await AdminProductService.create(body)
    return c.json({ data: toResponse(product) }, 201)
  }

  static async update(c: Context) {
    const { id } = c.req.param()
    const body = c.req.valid('json' as never)
    const product = await AdminProductService.update(id, body)
    return c.json({ data: toResponse(product) }, 200)
  }

  static async deactivate(c: Context) {
    const { id } = c.req.param()
    await AdminProductService.deactivate(id)
    return c.json({ data: null }, 200)
  }
}
