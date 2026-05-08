import { HTTPException } from "hono/http-exception";
import { prisma } from "../../lib/prisma.js";

export class OrderService {
  static async placeOrder(
    employeeId: string,
    orders: { productId: string; amount: number }[],
  ) {
    const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
    if (!employee) {
      throw new HTTPException(404, { message: "Employee not found" });
    }

    const created = [];
    for (const { productId, amount } of orders) {
      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product) {
        throw new HTTPException(404, { message: `Product ${productId} not found` });
      }

      const order = await prisma.order.create({
        data: { employeeId, productId, amount, price: Math.round(product.price * amount * 100) / 100 },
      });
      created.push(order);
    }

    return created;
  }
}
