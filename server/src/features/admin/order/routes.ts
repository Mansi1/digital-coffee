import { z } from "zod";
import { Routes } from "../../../class/RouterClass.js";
import { requireAuth } from "../../../middleware/require-auth.js";
import { requireRole } from "../../../middleware/require-role.js";
import { AdminOrderController } from "./controller.js";
import {
  AdminOrderDeleteResponseSchema,
  AdminOrderListResponseSchema,
  AdminOrderStatsSchema,
  ErrorSchema,
} from "./schema.js";

const adminGuard = [requireAuth, requireRole("ADMIN")];

const { router: adminOrderRoutes } = new Routes([
  {
    path: "/",
    method: "get",
    tags: ["Admin"],
    description: "List all orders — optional query params: dateFrom, dateTo, employeeId, productId",
    middleware: adminGuard,
    responses: {
      200: {
        content: { "application/json": { schema: AdminOrderListResponseSchema } },
        description: "All orders",
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
    controllerFN: AdminOrderController.getAll,
  },
  {
    path: "/stats",
    method: "get",
    tags: ["Admin"],
    description: "Order statistics: top products by quantity, revenue per month (last 12 months)",
    middleware: adminGuard,
    responses: {
      200: {
        content: { "application/json": { schema: AdminOrderStatsSchema } },
        description: "Order statistics",
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
    controllerFN: AdminOrderController.getStats,
  },
  {
    path: "/last-month",
    method: "delete",
    tags: ["Admin"],
    description: "Delete all orders from the previous calendar month",
    middleware: adminGuard,
    responses: {
      200: {
        content: { "application/json": { schema: AdminOrderDeleteResponseSchema } },
        description: "Orders deleted",
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
    controllerFN: AdminOrderController.deleteLastMonth,
  },
  {
    path: "/export",
    method: "get",
    tags: ["Admin"],
    description: "Export orders as CSV — optional query params: from, to (ISO date strings)",
    middleware: adminGuard,
    responses: {
      200: {
        content: { "text/csv": { schema: z.string() } },
        description: "CSV file",
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
    controllerFN: AdminOrderController.exportCsv,
  },
]);

export { adminOrderRoutes };
