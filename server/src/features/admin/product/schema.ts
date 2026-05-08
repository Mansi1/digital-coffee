import { z } from 'zod'

export { ErrorSchema } from '../../../schemas/common.js'

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const ProductCreateSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
})

export const ProductUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  isActive: z.boolean().optional(),
})

export const ProductListResponseSchema = z.object({
  data: z.array(ProductSchema),
})

export const ProductResponseSchema = z.object({
  data: ProductSchema,
})

export type TProductCreate = z.infer<typeof ProductCreateSchema>
export type TProductUpdate = z.infer<typeof ProductUpdateSchema>
