import { prisma } from "../src/lib/prisma.js";
import { seedCompany } from "./data/company.js";
import { seedOrders } from "./data/order.js";
import { seedProduct } from "./data/product.js";
import { seedEmployees } from "./data/employees.js";

async function main() {
  // Delete existing data
  await prisma.order.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.product.deleteMany();
  await prisma.company.deleteMany();

  // Seed new data
  const { bayernSoft, waldTec, deggendorfDigital, donauLogistik } = await seedCompany(prisma);
  const { admin, employeeCount } = await seedEmployees(prisma);
  const { productCount } = await seedProduct(prisma);
  const { orderCount } = await seedOrders(prisma);

  console.log("Seeded:", {
    companies: [bayernSoft.name, waldTec.name, deggendorfDigital.name, donauLogistik.name],
    admin: admin.email,
    employeeCount,
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
