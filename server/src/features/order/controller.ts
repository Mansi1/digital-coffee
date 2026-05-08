import type { Context } from "hono";
import type { TOrderBody } from "./schema.js";
import { OrderService } from "./service.js";

export class OrderController {
  static async placeOrder(c: Context) {
    const { employeeId, orders }: TOrderBody = c.req.valid("json" as never);
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
