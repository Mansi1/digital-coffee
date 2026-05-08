import { z } from 'zod'
import { Routes } from '../../../class/RouterClass.js'
import { AuthController } from '../../auth/controller.js'
import { AuthLoginSchema, AuthResponseSchema, ErrorSchema } from '../../auth/schema.js'

const { router: adminAuthRoutes } = new Routes([
  {
    path: '/login',
    method: 'post',
    tags: ['Admin'],
    description: 'Admin login (JWT will be added in a future release)',
    request: {
      body: {
        content: { 'application/json': { schema: AuthLoginSchema } },
        required: true,
      },
    },
    responses: {
      200: {
        content: { 'application/json': { schema: AuthResponseSchema } },
        description: 'Admin authenticated successfully',
      },
      400: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Invalid request data',
      },
      401: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Invalid credentials',
      },
      403: {
        content: { 'application/json': { schema: z.object({ error: z.object({ message: z.string() }) }) } },
        description: 'Insufficient permissions — admin role required',
      },
    },
    controllerFN: AuthController.identify,
  },
])

export { adminAuthRoutes }
