import { prisma } from "../src/lib/prisma.js";
import { seedCompany } from "./data/company.js";
import { seedOrders } from "./data/order.js";
import { seedProduct } from "./data/product.js";
import { seedUser } from "./data/user.js";

async function main() {
  // Delete existing data
  await prisma.order.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.product.deleteMany();
  await prisma.company.deleteMany();

  // Seed new data
  const { exampleCompany, anotherCompany } = await seedCompany(prisma);
  const { admin, user } = await seedUser(prisma);
  const { productCount } = await seedProduct(prisma);

  const { orderCount } = await seedOrders(prisma);

  console.log("Seeded:", {
    exampleCompany,
    anotherCompany,
    admin,
    user,
    productCount,
    orderCount,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
