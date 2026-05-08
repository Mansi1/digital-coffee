import { Routes } from "../../class/RouterClass.js";
import { OrderController } from "./controller.js";
import { ErrorSchema, OrderBodySchema, OrderResponseSchema } from "./schema.js";

const { router: orderRoutes } = new Routes([
  {
    path: "/",
    method: "post",
    description: "Create a new order",
    tags: ["Order"],
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
]);

export { orderRoutes };
