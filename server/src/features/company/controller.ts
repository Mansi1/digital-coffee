import { Context } from "hono";
import { prisma } from "../../lib/prisma.js";
import { CompanyService } from "./service.js";

export class CompanyController {
  static async getAll(c: Context) {
    const companies = await CompanyService.getAll();
    return c.json({ data: companies });
  }
}
