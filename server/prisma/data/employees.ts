import { hash } from "argon2";
import { PrismaClient } from "../../src/generated/prisma/client";

export async function seedEmployees(prisma: PrismaClient) {
  const exampleCompany = await prisma.company.findUniqueOrThrow({
    where: { email: "info@example.com" },
  });

  const anotherCompany = await prisma.company.findUniqueOrThrow({
    where: { email: "info@anotherCompany.com" },
  });

  const admin = await prisma.employee.upsert({
    where: { email: "john.doe@example.com" },
    update: {},
    create: {
      email: "john.doe@example.com",
      name: "John Doe",
      pin: await hash("12345"),
      role: "ADMIN",
      company: { connect: { id: exampleCompany.id } },
    },
  });

  const user = await prisma.employee.upsert({
    where: { email: "max.mustermann@example.com" },
    update: {},
    create: {
      name: "Max Mustermann",
      email: "max.mustermann@example.com",
      pin: await hash("12345"),
      role: "USER",
      company: { connect: { id: anotherCompany.id } },
    },
  });

  return { admin, user };
}
