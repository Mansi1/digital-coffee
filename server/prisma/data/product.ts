import { PrismaClient } from "../../src/generated/prisma/client";

export async function seedProduct(prisma: PrismaClient) {
  const { count } = await prisma.product.createMany({
    data: [
      {
        name: "Espresso",
        price: 0.5,
      },
      {
        name: "Cappuccino",
        price: 0.8,
      },
      {
        name: "Kaffee",
        price: 0.5,
      },
      {
        name: "Latte Macchiato",
        price: 1.2,
      },
    ],
  });

  return { productCount: count };
}
