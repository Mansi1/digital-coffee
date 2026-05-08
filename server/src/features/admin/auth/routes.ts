import { z } from 'zod'
import { Routes } from '../../../class/RouterClass.js'
import { requireAuth } from '../../../middleware/require-auth.js'
import { AdminAuthController } from './controller.js'
import { AuthLoginSchema, AuthResponseSchema, ErrorSchema } from '../../auth/schema.js'

const AdminInfoResponseSchema = z.object({
  data: z.object({
    id: z.string(),
    email: z.string(),
    role: z.string(),
    companyId: z.string(),
  }),
})

const { router: adminAuthRoutes } = new Routes([
  {
    path: '/login',
    method: 'post',
    tags: ['Admin'],
    description: 'Admin login — verifies ADMIN role and sets JWT cookie',
    request: {
      body: {
        content: { 'application/json': { schema: AuthLoginSchema } },
        required: true,
      },
    },
    responses: {
      200: {
        content: { 'application/json': { schema: AuthResponseSchema } },
        description: 'Logged in — JWT cookie set',
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
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Admin role required',
      },
    },
    controllerFN: AdminAuthController.login,
  },
  {
    path: '/info',
    method: 'get',
    tags: ['Admin'],
    description: 'Returns current admin session — frontend uses this to check login state',
    middleware: [requireAuth],
    responses: {
      200: {
        content: { 'application/json': { schema: AdminInfoResponseSchema } },
        description: 'Currently logged in admin',
      },
      401: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Not authenticated',
      },
    },
    controllerFN: AdminAuthController.info,
  },
  {
    path: '/logout',
    method: 'post',
    tags: ['Admin'],
    description: 'Clears the JWT cookie',
    responses: {
      200: {
        content: { 'application/json': { schema: z.object({ data: z.null() }) } },
        description: 'Logged out',
      },
    },
    controllerFN: AdminAuthController.logout,
  },
])

export { adminAuthRoutes }
