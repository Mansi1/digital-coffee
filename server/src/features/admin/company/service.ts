import { HTTPException } from "hono/http-exception";
import { prisma } from "../../../lib/prisma.js";
import type { TAdminCompanyCreate, TAdminCompanyUpdate } from "./schema.js";

export class AdminCompanyService {
  static async getAll() {
    return prisma.company.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        deactivatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async create(data: TAdminCompanyCreate) {
    return prisma.company.create({
      data,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        deactivatedAt: true,
      },
    });
  }

  static async update(id: string, data: TAdminCompanyUpdate) {
    const company = await prisma.company.findUnique({ where: { id } });
    if (!company) throw new HTTPException(404, { message: "Company not found" });

    return prisma.company.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        deactivatedAt: true,
      },
    });
  }

  static async deactivate(id: string) {
    const company = await prisma.company.findUnique({ where: { id } });
    if (!company) throw new HTTPException(404, { message: "Company not found" });

    return prisma.company.update({
      where: { id },
      data: { deactivatedAt: new Date() },
      select: { id: true },
    });
  }
}
