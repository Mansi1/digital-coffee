import { HTTPException } from 'hono/http-exception'
import { prisma } from '../../../lib/prisma.js'
import type { TProductCreate, TProductUpdate } from './schema.js'

export class AdminProductService {
  static async getAll() {
    return prisma.product.findMany({ orderBy: { name: 'asc' } })
  }

  static async create(data: TProductCreate) {
    return prisma.product.create({ data })
  }

  static async update(id: string, data: TProductUpdate) {
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
