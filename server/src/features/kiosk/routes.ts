import { Routes } from "../../class/RouterClass.js";
import { AuthController } from "../auth/controller.js";
import { OrderController } from "../order/controller.js";
import {
  AuthLoginSchema,
  AuthResponseSchema,
  ErrorSchema as AuthErrorSchema,
} from "../auth/schema.js";
import {
  ErrorSchema,
  OrderBodySchema,
  OrderResponseSchema,
} from "../order/schema.js";
import { ProductController } from "../product/controller.js";
import { EmployeeController } from "../employee/controller.js";
import { EmployeeResponseSchema } from "../employee/schema.js";

const { router: kioskRoutes } = new Routes([
  {
    path: "/identify",
    method: "post",
    tags: ["Kiosk"],
    description: "Identify employee with ID and PIN",
    request: {
      body: {
        content: { "application/json": { schema: AuthLoginSchema } },
        required: true,
      },
    },
    responses: {
      200: {
        content: { "application/json": { schema: AuthResponseSchema } },
        description: "Employee identified successfully",
      },
      400: {
        content: { "application/json": { schema: AuthErrorSchema } },
        description: "Invalid request data",
      },
      401: {
        content: { "application/json": { schema: AuthErrorSchema } },
        description: "Invalid credentials",
      },
    },
    controllerFN: AuthController.identify,
  },
  {
    path: "/products",
    method: "get",
    tags: ["Kiosk"],
    description: "Get list of available coffee products",
    responses: {
      200: {
        content: { "application/json": { schema: OrderResponseSchema } },
        description: "List of products retrieved successfully",
      },
      500: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Server error while retrieving products",
      },
    },
    controllerFN: ProductController.allProducts,
  },
  {
    path: "/orders",
    method: "post",
    tags: ["Kiosk"],
    description: "Place a coffee order",
    request: {
      body: {
        content: { "application/json": { schema: OrderBodySchema } },
        required: true,
      },
    },
    responses: {
      201: {
        content: { "application/json": { schema: OrderResponseSchema } },
        description: "Order placed successfully",
      },
      400: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Invalid order data",
      },
      404: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Employee or product not found",
      },
    },
    controllerFN: OrderController.placeOrder,
  },
  {
    path: "/employees",
    method: "get",
    tags: ["Kiosk"],
    description: "Get list of active employees (for testing/demo purposes)",
    responses: {
      200: {
        content: { "application/json": { schema: EmployeeResponseSchema } },
        description: "List of employees retrieved successfully",
      },
      500: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Server error while retrieving employees",
      },
    },
    controllerFN: EmployeeController.getAll,
  },
]);

export { kioskRoutes };
