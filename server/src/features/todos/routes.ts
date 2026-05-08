import { z } from 'zod'

import { Routes } from '../../class/RouterClass.js'
import { requireAuth } from '../../middleware/require-auth.js'
import { requirePermission } from '../../middleware/require-permission.js'
import { TodosController } from './controller.js'
import {
  CreateTodoBodySchema,
  ErrorSchema,
  MessageResponseSchema,
  TodoResponseSchema,
  TodosResponseSchema,
  UpdateTodoBodySchema,
} from './schema.js'

const { router: todosRoutes } = new Routes([
  {
    path: '/',
    method: 'get',
    tags: ['Todos'],
    description: 'Get all todos for the logged in user',
    middleware: [requireAuth, requirePermission('todo:read')],
    responses: {
      200: {
        content: { 'application/json': { schema: TodosResponseSchema } },
        description: 'List of todos of the logged in user',
      },
      401: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Unauthorized. User is not authenticated',
      },
      403: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Forbidden. User does not have the required permissions',
      },
    },
    controllerFN: TodosController.getAll,
  },
  {
    path: '/',
    method: 'post',
    tags: ['Todos'],
    description: 'Create a new todo',
    middleware: [requireAuth, requirePermission('todo:write')],
    request: {
      body: {
        content: { 'application/json': { schema: CreateTodoBodySchema } },
        required: true,
      },
    },
    responses: {
      201: {
        content: { 'application/json': { schema: TodoResponseSchema } },
        description: 'Todo created',
      },
      400: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Bad request. Invalid or missing request body',
      },
      401: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Unauthorized. User is not authenticated',
      },
      403: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Forbidden. User does not have the required permissions',
      },
    },
    controllerFN: TodosController.create,
  },
  {
    path: '/{id}',
    method: 'get',
    tags: ['Todos'],
    description: 'Get a todo by id',
    middleware: [requireAuth, requirePermission('todo:read')],
    request: {
      params: z.object({ id: z.string() }),
    },
    responses: {
      200: {
        content: { 'application/json': { schema: TodoResponseSchema } },
        description: 'Todo found',
      },
      401: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Unauthorized. User is not authenticated',
      },
      404: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Todo not found or does not belong to the user',
      },
    },
    controllerFN: TodosController.getById,
  },
  {
    path: '/{id}',
    method: 'patch',
    tags: ['Todos'],
    description: 'Update a todo',
    middleware: [requireAuth, requirePermission('todo:write')],
    request: {
      params: z.object({ id: z.string() }),
      body: {
        content: { 'application/json': { schema: UpdateTodoBodySchema } },
        required: true,
      },
    },
    responses: {
      200: {
        content: { 'application/json': { schema: TodoResponseSchema } },
        description: 'Todo updated',
      },
      400: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Bad request. Invalid or missing request body',
      },
      401: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Unauthorized. User is not authenticated',
      },
      403: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Forbidden. User does not have the required permissions',
      },
      404: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Todo not found or does not belong to the user',
      },
    },
    controllerFN: TodosController.update,
  },
  {
    path: '/{id}',
    method: 'delete',
    tags: ['Todos'],
    description: 'Delete a todo',
    middleware: [requireAuth, requirePermission('todo:delete')],
    request: {
      params: z.object({ id: z.string() }),
    },
    responses: {
      200: {
        content: { 'application/json': { schema: MessageResponseSchema } },
        description: 'Todo deleted',
      },
      401: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Unauthorized. User is not authenticated',
      },
      403: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Forbidden. User does not have the required permissions',
      },
      404: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Todo not found or does not belong to the user',
      },
    },
    controllerFN: TodosController.delete,
  },
])

export { todosRoutes }
