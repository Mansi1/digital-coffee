import type { Context } from "hono";
import { AdminEmployeeService } from "./service.js";
import type { TAdminEmployeeUpdate } from "./schema.js";

export class AdminEmployeeController {
  static async getAll(c: Context) {
    const employees = await AdminEmployeeService.getAll();
    return c.json({
      data: employees.map((e) => ({
        ...e,
        createdAt: e.createdAt.toISOString(),
        deactivatedAt: e.deactivatedAt?.toISOString() ?? null,
      })),
    });
  }

  static async update(c: Context) {
    const { id } = c.req.param();
    const data: TAdminEmployeeUpdate = c.req.valid("json" as never);
    const employee = await AdminEmployeeService.update(id, data);
    return c.json({
      data: {
        ...employee,
        createdAt: employee.createdAt.toISOString(),
        deactivatedAt: employee.deactivatedAt?.toISOString() ?? null,
      },
    });
  }

  static async deactivate(c: Context) {
    const { id } = c.req.param();
    await AdminEmployeeService.deactivate(id);
    return c.json({ data: null });
  }
}
