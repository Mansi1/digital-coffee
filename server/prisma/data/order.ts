import { PrismaClient } from "../../src/generated/prisma/client";

export async function seedOrders(prisma: PrismaClient) {
  const employees = await prisma.employee.findMany();
  const products = await prisma.product.findMany();

  if (employees.length === 0 || products.length === 0) {
    console.warn("Keine Employees oder Produkte gefunden, Orders werden übersprungen");
    return { orderCount: 0 };
  }

  const espresso = products.find((p) => p.name === "Espresso") ?? products[0];
  const cappuccino = products.find((p) => p.name === "Cappuccino") ?? products[1 % products.length];
  const latte = products.find((p) => p.name === "Latte Macchiato") ?? products[2 % products.length];
  const kaffee = products.find((p) => p.name === "Kaffee") ?? products[3 % products.length];

  const orderData = employees.flatMap((employee) => [
    {
      employeeId: employee.id,
      productId: espresso.id,
      amount: 2,
      price: espresso.price * 2,
      createdAt: new Date("2026-05-06T08:15:00Z"),
      updatedAt: new Date("2026-05-06T08:15:00Z"),
    },
    {
      employeeId: employee.id,
      productId: cappuccino.id,
      amount: 1,
      price: cappuccino.price,
      createdAt: new Date("2026-05-07T10:30:00Z"),
      updatedAt: new Date("2026-05-07T10:30:00Z"),
    },
    {
      employeeId: employee.id,
      productId: latte.id,
      amount: 1,
      price: latte.price,
      createdAt: new Date("2026-05-07T14:00:00Z"),
      updatedAt: new Date("2026-05-07T14:00:00Z"),
    },
    {
      employeeId: employee.id,
      productId: kaffee.id,
      amount: 3,
      price: kaffee.price * 3,
      createdAt: new Date("2026-05-08T09:00:00Z"),
      updatedAt: new Date("2026-05-08T09:00:00Z"),
    },
  ]);

  const { count } = await prisma.order.createMany({ data: orderData });
  return { orderCount: count };
}
