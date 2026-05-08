import { z } from 'zod'

export { ErrorSchema } from '../../schemas/common.js'

export const AuthLoginSchema = z.object({
  employeeId: z.string(),
  pin: z.string().min(4),
})

export type TAuthLoginSchema = z.infer<typeof AuthLoginSchema>

export const AuthEmployeeSchema = z.object({
  id: z.string(),
  email: z.email(),
  role: z.enum(['USER', 'ADMIN', 'NONE']),
  companyId: z.string(),
})

export const AuthResponseSchema = z.object({
  data: AuthEmployeeSchema,
})
