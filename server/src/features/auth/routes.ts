import { z } from 'zod'
import { Routes } from '../../class/RouterClass.js'
import { requireAuth } from '../../middleware/require-auth.js'
import { AuthController } from './controller.js'
import { AuthBodySchema, AuthResponseSchema, AuthUserSchema, ErrorSchema } from './schema.js'

const { router: authRoutes } = new Routes([
  {
    path: '/register',
    method: 'post',
    tags: ['Auth'],
    description: 'Register a new user',
    request: {
      body: {
        content: { 'application/json': { schema: AuthBodySchema } },
        required: true,
      },
    },
    responses: {
      201: {
        content: { 'application/json': { schema: AuthResponseSchema } },
        description: 'User registered successfully',
      },
      400: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Invalid request data',
      },
      409: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'User already exists',
      },
    },
    controllerFN: AuthController.register,
  },
  {
    path: '/login',
    method: 'post',
    tags: ['Auth'],
    description: 'Login with email and password',
    request: {
      body: {
        content: { 'application/json': { schema: AuthBodySchema } },
        required: true,
      },
    },
    responses: {
      200: {
        content: { 'application/json': { schema: AuthResponseSchema } },
        description: 'Login successful',
      },
      401: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Invalid credentials',
      },
    },
    controllerFN: AuthController.login,
  },
  {
    path: '/logout',
    method: 'post',
    tags: ['Auth'],
    description: 'Logout the current user',
    responses: {
      200: {
        content: { 'application/json': { schema: z.object({ message: z.string() }) } },
        description: 'Logout successful',
      },
      401: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Not authenticated',
      },
    },
    controllerFN: AuthController.logout,
  },
  {
    path: '/me',
    method: 'get',
    tags: ['Auth'],
    description: 'Get the currently authenticated user',
    middleware: [requireAuth],
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.object({ user: AuthUserSchema }),
          },
        },
        description: 'Current user data',
      },
      401: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Not authenticated',
      },
    },
    controllerFN: AuthController.me,
  },
])

export { authRoutes }
