import { z } from 'zod'

export const ErrorSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
})
