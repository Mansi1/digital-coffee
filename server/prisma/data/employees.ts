import { hash } from "argon2";
import { PrismaClient } from "../../src/generated/prisma/client";

export async function seedEmployees(prisma: PrismaClient) {
  const [bayernSoft, waldTec, deggendorfDigital, donauLogistik] =
    await Promise.all([
      prisma.company.findUniqueOrThrow({
        where: { email: "info@bayernsoft.de" },
      }),
      prisma.company.findUniqueOrThrow({ where: { email: "info@waldtec.de" } }),
      prisma.company.findUniqueOrThrow({
        where: { email: "info@deggendorf-digital.de" },
      }),
      prisma.company.findUniqueOrThrow({
        where: { email: "info@donaulogistik.de" },
      }),
    ]);

  const definitions = [
    // BayernSoft GmbH — 3 Mitarbeiter (1 Admin)
    {
      name: "Anna Bauer",
      email: "a.bauer@bayernsoft.de",
      pin: "11111",
      role: "ADMIN" as const,
      companyId: bayernSoft.id,
    },
    {
      name: "Thomas Huber",
      email: "t.huber@bayernsoft.de",
      pin: "22222",
      role: "USER" as const,
      companyId: bayernSoft.id,
    },
    {
      name: "Lisa Wagner",
      email: "l.wagner@bayernsoft.de",
      pin: "33333",
      role: "USER" as const,
      companyId: bayernSoft.id,
    },
    // WaldTec AG — 3 Mitarbeiter (1 Admin)
    {
      name: "Klaus Schmitt",
      email: "k.schmitt@waldtec.de",
      pin: "44444",
      role: "ADMIN" as const,
      companyId: waldTec.id,
    },
    {
      name: "Maria Fischer",
      email: "m.fischer@waldtec.de",
      pin: "55555",
      role: "USER" as const,
      companyId: waldTec.id,
    },
    {
      name: "Stefan Müller",
      email: "s.mueller@waldtec.de",
      pin: "66666",
      role: "USER" as const,
      companyId: waldTec.id,
    },
    // Deggendorf Digital KG — 2 Mitarbeiter (1 Admin)
    {
      name: "Julia Berger",
      email: "j.berger@deggendorf-digital.de",
      pin: "77777",
      role: "ADMIN" as const,
      companyId: deggendorfDigital.id,
    },
    {
      name: "Felix Eder",
      email: "f.eder@deggendorf-digital.de",
      pin: "88888",
      role: "USER" as const,
      companyId: deggendorfDigital.id,
    },
    // Donau Logistik GmbH — 2 Mitarbeiter (1 Admin)
    {
      name: "Petra Gruber",
      email: "p.gruber@donaulogistik.de",
      pin: "99999",
      role: "ADMIN" as const,
      companyId: donauLogistik.id,
    },
    {
      name: "Michael Lang",
      email: "m.lang@donaulogistik.de",
      pin: "00000",
      role: "USER" as const,
      companyId: donauLogistik.id,
    },
  ];

  const created = [];
  for (const def of definitions) {
    const employee = await prisma.employee.upsert({
      where: { email: def.email },
      update: {},
      create: {
        name: def.name,
        email: def.email,
        pin: await hash(def.pin),
        role: def.role,
        companyId: def.companyId,
      },
    });
    created.push(employee);
  }

  return { admin: created[0], employeeCount: created.length };
}
