import { z } from 'zod'

export { ErrorSchema } from '../../schemas/common.js'

export const AuthBodySchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

export type TAuthBodySchema = z.infer<typeof AuthBodySchema>

export const AuthUserSchema = z.object({
  id: z.string(),
  email: z.email(),
  role: z.enum(['USER', 'ADMIN']),
})

export const AuthResponseSchema = z.object({
  data: AuthUserSchema,
})
