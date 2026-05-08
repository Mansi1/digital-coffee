import { z } from 'zod'

export const TodoSchema = z.object({
  id: z.string(),
  title: z.string(),
  isCompleted: z.boolean(),
  createdAt: z.string(),
})

export const TodoResponseSchema = z.object({
  data: TodoSchema,
})

export const TodosResponseSchema = z.object({
  data: z.array(TodoSchema),
})

export const CreateTodoBodySchema = z.object({
  title: z.string().min(1),
})

export const UpdateTodoBodySchema = z.object({
  title: z.string().min(1).optional(),
  isCompleted: z.boolean().optional(),
})

export const MessageResponseSchema = z.object({
  message: z.string(),
})

export { ErrorSchema } from '../../schemas/common.js'
