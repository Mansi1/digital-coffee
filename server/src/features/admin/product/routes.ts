import { z } from "zod";
import { Routes } from "../../../class/RouterClass.js";
import { ProductController } from "../../product/controller.js";
import {
  ErrorSchema,
  ProductCreateSchema,
  ProductListResponseSchema,
  ProductResponseSchema,
  ProductUpdateSchema,
} from "./schema.js";
import { requireAuth } from "../../../middleware/require-auth.js";
import { requireRole } from "../../../middleware/require-role.js";

const adminGuard = [requireAuth, requireRole("ADMIN")];

const { router: adminProductRoutes } = new Routes([
  {
    path: "/",
    method: "get",
    tags: ["Admin"],
    description: "List all products",
    middleware: adminGuard,
    responses: {
      200: {
        content: { "application/json": { schema: ProductListResponseSchema } },
        description: "All products",
      },
      401: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Unauthorized — valid JWT required",
      },
    },
    controllerFN: ProductController.getAll,
  },
  {
    path: "/",
    method: "post",
    tags: ["Admin"],
    description: "Create a new product",
    middleware: adminGuard,
    request: {
      body: {
        content: { "application/json": { schema: ProductCreateSchema } },
        required: true,
      },
    },
    responses: {
      201: {
        content: { "application/json": { schema: ProductResponseSchema } },
        description: "Product created",
      },
      400: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Invalid data",
      },
      401: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Unauthorized — valid JWT required",
      },
    },
    controllerFN: ProductController.create,
  },
  {
    path: "/{id}",
    method: "patch",
    tags: ["Admin"],
    description: "Update product name, price or active status",
    middleware: adminGuard,
    request: {
      params: z.object({ id: z.string() }),
      body: {
        content: { "application/json": { schema: ProductUpdateSchema } },
        required: true,
      },
    },
    responses: {
      200: {
        content: { "application/json": { schema: ProductResponseSchema } },
        description: "Product updated",
      },
      400: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Invalid data",
      },
      401: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Unauthorized — valid JWT required",
      },
      404: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Product not found",
      },
    },
    controllerFN: ProductController.update,
  },
  {
    path: "/{id}",
    method: "delete",
    tags: ["Admin"],
    description: "Deactivate a product",
    middleware: adminGuard,
    request: {
      params: z.object({ id: z.string() }),
    },
    responses: {
      200: {
        content: {
          "application/json": { schema: z.object({ data: z.null() }) },
        },
        description: "Product deactivated",
      },
      401: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Unauthorized — valid JWT required",
      },
      404: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Product not found",
      },
    },
    controllerFN: ProductController.deactivate,
  },
]);

export { adminProductRoutes };
