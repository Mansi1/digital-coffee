import { Routes } from "../../class/RouterClass.js";
import { AuthController } from "../auth/controller.js";
import { OrderController } from "../order/controller.js";
import {
  AuthLoginSchema,
  AuthResponseSchema,
  ErrorSchema as AuthErrorSchema,
  AuthRegisterSchema,
} from "../auth/schema.js";
import {
  ErrorSchema,
  OrderBodySchema,
  OrderResponseSchema,
} from "../order/schema.js";
import { ProductController } from "../product/controller.js";
import { EmployeeController } from "../employee/controller.js";
import { EmployeeResponseSchema } from "../employee/schema.js";
import { CompanyController } from "../company/controller.js";
import z from "zod";

const { router: kioskRoutes } = new Routes([
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
  {
    path: "/companies",
    method: "get",
    tags: ["Kiosk"],
    description: "Get list of companies (for testing/demo purposes)",
    responses: {
      200: {
        content: {
          "application/json": {
            schema: z.object({
              data: z.array(
                z.object({
                  id: z.string(),
                  name: z.string(),
                  email: z.email(),
                }),
              ),
            }),
          },
        },
        description: "List of companies retrieved successfully",
      },
      500: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Server error while retrieving companies",
      },
    },
    controllerFN: CompanyController.getAll,
  },
  {
    path: "/register",
    method: "post",
    tags: ["Kiosk"],
    description: "Register a new employee (for testing/demo purposes)",
    request: {
      body: {
        content: { "application/json": { schema: AuthRegisterSchema } },
        required: true,
      },
    },
    responses: {
      201: {
        content: { "application/json": { schema: AuthResponseSchema } },
        description: "Employee registered successfully",
      },
      400: {
        content: { "application/json": { schema: AuthErrorSchema } },
        description: "Invalid request data",
      },
      409: {
        content: { "application/json": { schema: AuthErrorSchema } },
        description: "Employee with this email already exists",
      },
    },
    controllerFN: AuthController.register,
  },
  {
    path: "/orders/{employeeId}",
    method: "get",
    tags: ["Kiosk"],
    description: "Get order history for a specific employee",
    request: {
      params: z.object({ employeeId: z.string() }),
    },
    responses: {
      200: {
        content: {
          "application/json": {
            schema: z.object({
              data: z.array(
                z.object({
                  id: z.string(),
                  productId: z.string(),
                  productName: z.string(),
                  amount: z.number().int(),
                  price: z.number(),
                  createdAt: z.string(),
                }),
              ),
            }),
          },
        },
        description: "Order history retrieved successfully",
      },
      404: {
        content: { "application/json": { schema: ErrorSchema } },
        description: "Employee not found",
      },
    },
    controllerFN: OrderController.getByEmployee,
  },
]);

export { kioskRoutes };
