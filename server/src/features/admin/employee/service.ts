import { HTTPException } from "hono/http-exception";
import { prisma } from "../../../lib/prisma.js";
import type { TAdminEmployeeUpdate } from "./schema.js";

export class AdminEmployeeService {
  static async getAll() {
    return prisma.employee.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyId: true,
        createdAt: true,
        deactivatedAt: true,
        company: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async update(id: string, data: TAdminEmployeeUpdate) {
    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new HTTPException(404, { message: "Employee not found" });

    return prisma.employee.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        companyId: true,
        createdAt: true,
        deactivatedAt: true,
        company: { select: { name: true } },
      },
    });
  }

  static async deactivate(id: string) {
    const employee = await prisma.employee.findUnique({ where: { id } });
    if (!employee) throw new HTTPException(404, { message: "Employee not found" });

    return prisma.employee.update({
      where: { id },
      data: { deactivatedAt: new Date() },
      select: { id: true },
    });
  }
}
