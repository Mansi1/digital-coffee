import type { Context } from "hono";
import { AdminCompanyService } from "./service.js";
import type { TAdminCompanyCreate, TAdminCompanyUpdate } from "./schema.js";

export class AdminCompanyController {
  static async getAll(c: Context) {
    const companies = await AdminCompanyService.getAll();
    return c.json({
      data: companies.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        deactivatedAt: c.deactivatedAt?.toISOString() ?? null,
      })),
    });
  }

  static async create(c: Context) {
    const data: TAdminCompanyCreate = c.req.valid("json" as never);
    const company = await AdminCompanyService.create(data);
    return c.json(
      {
        data: {
          ...company,
          createdAt: company.createdAt.toISOString(),
          deactivatedAt: null,
        },
      },
      201,
    );
  }

  static async update(c: Context) {
    const { id } = c.req.param();
    const data: TAdminCompanyUpdate = c.req.valid("json" as never);
    const company = await AdminCompanyService.update(id, data);
    return c.json({
      data: {
        ...company,
        createdAt: company.createdAt.toISOString(),
        deactivatedAt: company.deactivatedAt?.toISOString() ?? null,
      },
    });
  }

  static async deactivate(c: Context) {
    const { id } = c.req.param();
    await AdminCompanyService.deactivate(id);
    return c.json({ data: null });
  }
}
