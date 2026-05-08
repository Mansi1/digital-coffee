import { PrismaClient } from "../../src/generated/prisma/client";

export async function seedProduct(prisma: PrismaClient) {
  const { count } = await prisma.product.createMany({
    data: [
      // Espresso-Basis
      { name: "Espresso",          price: 0.50 },
      { name: "Doppelter Espresso", price: 0.80 },
      // Milchkaffee
      { name: "Cappuccino",        price: 0.80 },
      { name: "Latte Macchiato",   price: 1.20 },
      { name: "Flat White",        price: 1.00 },
      // Kaffee klassisch
      { name: "Filterkaffee",      price: 0.50 },
      { name: "Americano",         price: 0.70 },
      // Tee & Sonstiges
      { name: "Schwarztee",        price: 0.40 },
      { name: "Grüntee",           price: 0.40 },
      { name: "Heiße Schokolade",  price: 1.00 },
    ],
  });

  return { productCount: count };
}
