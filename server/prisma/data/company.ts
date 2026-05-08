import { PrismaClient } from "../../src/generated/prisma/client";

export async function seedCompany(prisma: PrismaClient) {
  const exampleCompany = await prisma.company.upsert({
    where: {
      email: "info@example.com",
    },
    create: {
      name: "Example GmbH",
      email: "info@example.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    update: {
      name: "Example GmbH",
      updatedAt: new Date(),
    },
  });

  const anotherCompany = await prisma.company.upsert({
    where: {
      email: "info@anotherCompany.com",
    },
    create: {
      name: "Another Company AG",
      email: "info@anotherCompany.com",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    update: {
      name: "Another Company AG",
      updatedAt: new Date(),
    },
  });

  return { exampleCompany, anotherCompany };
}
