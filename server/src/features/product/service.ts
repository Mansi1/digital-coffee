import { prisma } from "../../lib/prisma.js";

export class ProductService {
  static async allProducts() {
    return await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: "desc" },
    });
  }
}
