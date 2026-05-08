import { Routes } from '../../class/RouterClass.js'
import { AuthController } from './controller.js'
import { AuthLoginSchema, AuthResponseSchema, ErrorSchema } from './schema.js'

const { router: authRoutes } = new Routes([
  {
    path: '/login',
    method: 'post',
    tags: ['Auth'],
    description: 'Identify employee with email and PIN',
    request: {
      body: {
        content: { 'application/json': { schema: AuthLoginSchema } },
        required: true,
      },
    },
    responses: {
      200: {
        content: { 'application/json': { schema: AuthResponseSchema } },
        description: 'Employee identified successfully',
      },
      400: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Invalid request data',
      },
      401: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Invalid credentials',
      },
    },
    controllerFN: AuthController.identify,
  },
])

export { authRoutes }
