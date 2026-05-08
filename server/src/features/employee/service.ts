import { prisma } from "../../lib/prisma.js";

export class EmployeeService {
  static async getAll() {
    return await prisma.employee.findMany({
      where: {
        isActive: true,
      },
      select: {
        name: true,
        company: {
          select: {
            name: true,
          },
        },
      },
    });
  }
}
