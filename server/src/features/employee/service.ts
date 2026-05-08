import { prisma } from "../../lib/prisma.js";

export class EmployeeService {
  static async getAll() {
    return await prisma.employee.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
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
