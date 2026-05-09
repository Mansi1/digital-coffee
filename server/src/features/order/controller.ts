import type { Context } from "hono";
import type { TOrderBody } from "./schema.js";
import { OrderService } from "./service.js";
import { AuthService } from "../auth/service.js";

export class OrderController {
  static async getByEmployee(c: Context) {
    const { employeeId } = c.req.param();
    const orders = await OrderService.getByEmployee(employeeId);
    return c.json({
      data: orders.map((o) => ({
        id: o.id,
        productId: o.productId,
        productName: o.product.name,
        amount: o.amount,
        price: o.price,
        createdAt: o.createdAt.toISOString(),
      })),
    });
  }

  static async placeOrder(c: Context) {
    const { employeeId, pin, orders }: TOrderBody = c.req.valid(
      "json" as never,
    );
    
    const isValidLogin = await AuthService.identifyEmployee(employeeId, pin);
    if (!isValidLogin) {
      return c.json({ error: "Invalid employee ID or PIN" }, 401);
    }

    const result = await OrderService.placeOrder(employeeId, orders);
    return c.json(
      {
        data: result.map((o) => ({
          id: o.id,
          productId: o.productId,
          employeeId: o.employeeId,
          amount: o.amount,
          price: o.price,
          createdAt: o.createdAt.toISOString(),
        })),
      },
      201,
    );
  }
}
