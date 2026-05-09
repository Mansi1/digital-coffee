import { z } from "zod";
import { Routes } from "../../../class/RouterClass.js";
import { requireAuth } from "../../../middleware/require-auth.js";
import { requireRole } from "../../../middleware/require-role.js";
import { AdminEmployeeController } from "./controller.js";
import {
  AdminEmployeeListResponseSchema,
  AdminEmployeeResponseSchema,
  AdminEmployeeUpdateSchema,
  ErrorSchema,
} from "./schema.js";

const adminGuard = [requireAuth, requireRole("ADMIN")];

const { router: adminEmployeeRoutes } = new Routes([
  {
    path: "/",
    method: "get",
    tags: ["Admin"],
    description: "List all employees including deactivated ones",
    middleware: adminGuard,
    responses: {
      200: {
        content: { "application/json": { schema: AdminEmployeeListResponseSchema } },
        description: "All employees",
      },
      401: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Unauthorized",
      },
      403: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Forbidden",
      },
    },
    controllerFN: AdminEmployeeController.getAll,
  },
  {
    path: "/{id}",
    method: "patch",
    tags: ["Admin"],
    description: "Update employee name or role",
    middleware: adminGuard,
    request: {
      params: z.object({ id: z.string() }),
      body: {
        content: { "application/json": { schema: AdminEmployeeUpdateSchema } },
        required: true,
      },
    },
    responses: {
      200: {
        content: { "application/json": { schema: AdminEmployeeResponseSchema } },
        description: "Employee updated",
      },
      400: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Invalid data",
      },
      401: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Unauthorized",
      },
      403: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Forbidden",
      },
      404: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Employee not found",
      },
    },
    controllerFN: AdminEmployeeController.update,
  },
  {
    path: "/{id}",
    method: "delete",
    tags: ["Admin"],
    description: "Deactivate an employee (soft delete)",
    middleware: adminGuard,
    request: {
      params: z.object({ id: z.string() }),
    },
    responses: {
      200: {
        content: { "application/json": { schema: z.object({ data: z.null() }) } },
        description: "Employee deactivated",
      },
      401: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Unauthorized",
      },
      403: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Forbidden",
      },
      404: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Employee not found",
      },
    },
    controllerFN: AdminEmployeeController.deactivate,
  },
]);

export { adminEmployeeRoutes };
