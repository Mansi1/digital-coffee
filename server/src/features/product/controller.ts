import type { Context } from 'hono'
import { ProductService } from './service.js'

const toResponse = (p: { id: string; name: string; price: number; deactivatedAt: Date | null; createdAt: Date; updatedAt: Date }) => ({
  id: p.id,
  name: p.name,
  price: p.price,
  deactivatedAt: p.deactivatedAt?.toISOString() ?? null,
  createdAt: p.createdAt.toISOString(),
  updatedAt: p.updatedAt.toISOString(),
})

export class ProductController {
  static async allProducts(c: Context) {
    const products = await ProductService.getActive()
    return c.json({ data: products.map(toResponse) }, 200)
  }

  static async getAll(c: Context) {
    const products = await ProductService.getAll()
    return c.json({ data: products.map(toResponse) }, 200)
  }

  static async create(c: Context) {
    const body = c.req.valid('json' as never)
    const product = await ProductService.create(body)
    return c.json({ data: toResponse(product) }, 201)
  }

  static async update(c: Context) {
    const { id } = c.req.param()
    const body = c.req.valid('json' as never)
    const product = await ProductService.update(id, body)
    return c.json({ data: toResponse(product) }, 200)
  }

  static async deactivate(c: Context) {
    const { id } = c.req.param()
    await ProductService.deactivate(id)
    return c.json({ data: null }, 200)
  }
}
