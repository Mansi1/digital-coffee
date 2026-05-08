import { prisma } from "../../lib/prisma.js";

export class CompanyService {
  static async getAll() {
    return await prisma.company.findMany({
      where: {
        deactivatedAt: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }
}
