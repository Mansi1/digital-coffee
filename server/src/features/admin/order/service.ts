import { prisma } from "../../../lib/prisma.js";

export class AdminOrderService {
  static async getAll(filters: {
    dateFrom?: string;
    dateTo?: string;
    employeeId?: string;
    productId?: string;
  }) {
    return prisma.order.findMany({
      where: {
        ...(filters.dateFrom && { createdAt: { gte: new Date(filters.dateFrom) } }),
        ...(filters.dateTo && { createdAt: { lte: new Date(filters.dateTo) } }),
        ...(filters.employeeId && { employeeId: filters.employeeId }),
        ...(filters.productId && { productId: filters.productId }),
      },
      include: {
        employee: { select: { name: true, company: { select: { name: true } } } },
        product: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getStats() {
    const topProducts = await prisma.order.groupBy({
      by: ["productId"],
      _sum: { amount: true },
      orderBy: { _sum: { amount: "desc" } },
      take: 10,
    });

    const productIds = topProducts.map((p) => p.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true },
    });

    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const recentOrders = await prisma.order.findMany({
      where: { createdAt: { gte: twelveMonthsAgo } },
      select: { price: true, createdAt: true },
    });

    const revenueByMonth = recentOrders.reduce(
      (acc, order) => {
        const month = order.createdAt.toISOString().slice(0, 7);
        acc[month] = (acc[month] ?? 0) + order.price;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      topProducts: topProducts.map((tp) => ({
        productId: tp.productId,
        name: products.find((p) => p.id === tp.productId)?.name ?? "Unknown",
        totalAmount: tp._sum.amount ?? 0,
      })),
      revenuePerMonth: Object.entries(revenueByMonth)
        .map(([month, revenue]) => ({
          month,
          revenue: Math.round(revenue * 100) / 100,
        }))
        .sort((a, b) => a.month.localeCompare(b.month)),
    };
  }

  static async deleteLastMonth() {
    const now = new Date();
    const firstDayOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const result = await prisma.order.deleteMany({
      where: {
        createdAt: {
          gte: firstDayOfLastMonth,
          lt: firstDayOfCurrentMonth,
        },
      },
    });

    return result.count;
  }

  static async exportCsv(from?: string, to?: string) {
    const orders = await prisma.order.findMany({
      where: {
        ...(from && { createdAt: { gte: new Date(from) } }),
        ...(to && { createdAt: { lte: new Date(to) } }),
      },
      include: {
        employee: { select: { name: true, company: { select: { name: true } } } },
        product: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const header = "id,employeeId,employeeName,companyName,productId,productName,amount,price,createdAt";
    const rows = orders.map((o) =>
      [
        o.id,
        o.employeeId,
        `"${o.employee.name.replace(/"/g, '""')}"`,
        `"${o.employee.company.name.replace(/"/g, '""')}"`,
        o.productId,
        `"${o.product.name.replace(/"/g, '""')}"`,
        o.amount,
        o.price,
        o.createdAt.toISOString(),
      ].join(","),
    );

    return [header, ...rows].join("\n");
  }
}
