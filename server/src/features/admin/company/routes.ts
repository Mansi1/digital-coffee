import { z } from "zod";
import { Routes } from "../../../class/RouterClass.js";
import { requireAuth } from "../../../middleware/require-auth.js";
import { requireRole } from "../../../middleware/require-role.js";
import { AdminCompanyController } from "./controller.js";
import {
  AdminCompanyCreateSchema,
  AdminCompanyListResponseSchema,
  AdminCompanyResponseSchema,
  AdminCompanyUpdateSchema,
  ErrorSchema,
} from "./schema.js";

const adminGuard = [requireAuth, requireRole("ADMIN")];

const { router: adminCompanyRoutes } = new Routes([
  {
    path: "/",
    method: "get",
    tags: ["Admin"],
    description: "List all companies including deactivated ones",
    middleware: adminGuard,
    responses: {
      200: {
        content: { "application/json": { schema: AdminCompanyListResponseSchema } },
        description: "All companies",
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
    controllerFN: AdminCompanyController.getAll,
  },
  {
    path: "/",
    method: "post",
    tags: ["Admin"],
    description: "Create a new company",
    middleware: adminGuard,
    request: {
      body: {
        content: { "application/json": { schema: AdminCompanyCreateSchema } },
        required: true,
      },
    },
    responses: {
      201: {
        content: { "application/json": { schema: AdminCompanyResponseSchema } },
        description: "Company created",
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
    },
    controllerFN: AdminCompanyController.create,
  },
  {
    path: "/{id}",
    method: "patch",
    tags: ["Admin"],
    description: "Update company name or email",
    middleware: adminGuard,
    request: {
      params: z.object({ id: z.string() }),
      body: {
        content: { "application/json": { schema: AdminCompanyUpdateSchema } },
        required: true,
      },
    },
    responses: {
      200: {
        content: { "application/json": { schema: AdminCompanyResponseSchema } },
        description: "Company updated",
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
        description: "Company not found",
      },
    },
    controllerFN: AdminCompanyController.update,
  },
  {
    path: "/{id}",
    method: "delete",
    tags: ["Admin"],
    description: "Deactivate a company (soft delete)",
    middleware: adminGuard,
    request: {
      params: z.object({ id: z.string() }),
    },
    responses: {
      200: {
        content: { "application/json": { schema: z.object({ data: z.null() }) } },
        description: "Company deactivated",
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
        description: "Company not found",
      },
    },
    controllerFN: AdminCompanyController.deactivate,
  },
]);

export { adminCompanyRoutes };
