import { z } from 'zod'
import { Routes } from '../../../class/RouterClass.js'
import { AdminProductController } from './controller.js'
import {
  ErrorSchema,
  ProductCreateSchema,
  ProductListResponseSchema,
  ProductResponseSchema,
  ProductUpdateSchema,
} from './schema.js'

const { router: adminProductRoutes } = new Routes([
  {
    path: '/',
    method: 'get',
    tags: ['Admin'],
    description: 'List all products',
    responses: {
      200: {
        content: { 'application/json': { schema: ProductListResponseSchema } },
        description: 'All products',
      },
    },
    controllerFN: AdminProductController.getAll,
  },
  {
    path: '/',
    method: 'post',
    tags: ['Admin'],
    description: 'Create a new product',
    request: {
      body: {
        content: { 'application/json': { schema: ProductCreateSchema } },
        required: true,
      },
    },
    responses: {
      201: {
        content: { 'application/json': { schema: ProductResponseSchema } },
        description: 'Product created',
      },
      400: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Invalid data',
      },
    },
    controllerFN: AdminProductController.create,
  },
  {
    path: '/{id}',
    method: 'patch',
    tags: ['Admin'],
    description: 'Update product name, price or active status',
    request: {
      params: z.object({ id: z.string() }),
      body: {
        content: { 'application/json': { schema: ProductUpdateSchema } },
        required: true,
      },
    },
    responses: {
      200: {
        content: { 'application/json': { schema: ProductResponseSchema } },
        description: 'Product updated',
      },
      400: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Invalid data',
      },
      404: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Product not found',
      },
    },
    controllerFN: AdminProductController.update,
  },
  {
    path: '/{id}',
    method: 'delete',
    tags: ['Admin'],
    description: 'Deactivate a product',
    request: {
      params: z.object({ id: z.string() }),
    },
    responses: {
      200: {
        content: { 'application/json': { schema: z.object({ data: z.null() }) } },
        description: 'Product deactivated',
      },
      404: {
        content: { 'application/json': { schema: ErrorSchema } },
        description: 'Product not found',
      },
    },
    controllerFN: AdminProductController.deactivate,
  },
])

export { adminProductRoutes }
