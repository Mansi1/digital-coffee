import type { Context } from "hono";
import { AdminOrderService } from "./service.js";

export class AdminOrderController {
  static async getAll(c: Context) {
    const { dateFrom, dateTo, employeeId, productId } = c.req.query();
    const orders = await AdminOrderService.getAll({ dateFrom, dateTo, employeeId, productId });
    return c.json({
      data: orders.map((o) => ({
        id: o.id,
        employeeId: o.employeeId,
        employeeName: o.employee.name,
        companyName: o.employee.company.name,
        productId: o.productId,
        productName: o.product.name,
        amount: o.amount,
        price: o.price,
        createdAt: o.createdAt.toISOString(),
      })),
    });
  }

  static async getStats(c: Context) {
    const stats = await AdminOrderService.getStats();
    return c.json({ data: stats });
  }

  static async deleteLastMonth(c: Context) {
    const deleted = await AdminOrderService.deleteLastMonth();
    return c.json({ data: { deleted } });
  }

  static async exportCsv(c: Context) {
    const { from, to } = c.req.query();
    const csv = await AdminOrderService.exportCsv(from, to);
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=orders.csv",
      },
    });
  }
}
