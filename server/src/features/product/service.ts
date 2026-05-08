import { HTTPException } from 'hono/http-exception'
import { prisma } from '../../lib/prisma.js'

export class ProductService {
  static async getActive() {
    return prisma.product.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } })
  }

  static async getAll() {
    return prisma.product.findMany({ orderBy: { name: 'asc' } })
  }

  static async create(data: { name: string; price: number }) {
    return prisma.product.create({ data })
  }

  static async update(id: string, data: { name?: string; price?: number; isActive?: boolean }) {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) throw new HTTPException(404, { message: 'Product not found' })
    return prisma.product.update({ where: { id }, data })
  }

  static async deactivate(id: string) {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) throw new HTTPException(404, { message: 'Product not found' })
    return prisma.product.update({ where: { id }, data: { isActive: false } })
  }
}
