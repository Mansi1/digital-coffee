import { PrismaClient } from "../../src/generated/prisma/client";

export async function seedCompany(prisma: PrismaClient) {
  const companies = await Promise.all([
    prisma.company.upsert({
      where: { email: "info@bayernsoft.de" },
      create: { name: "BayernSoft GmbH", email: "info@bayernsoft.de" },
      update: { name: "BayernSoft GmbH" },
    }),
    prisma.company.upsert({
      where: { email: "info@waldtec.de" },
      create: { name: "WaldTec AG", email: "info@waldtec.de" },
      update: { name: "WaldTec AG" },
    }),
    prisma.company.upsert({
      where: { email: "info@deggendorf-digital.de" },
      create: { name: "Deggendorf Digital KG", email: "info@deggendorf-digital.de" },
      update: { name: "Deggendorf Digital KG" },
    }),
    prisma.company.upsert({
      where: { email: "info@donaulogistik.de" },
      create: { name: "Donau Logistik GmbH", email: "info@donaulogistik.de" },
      update: { name: "Donau Logistik GmbH" },
    }),
  ]);

  return {
    bayernSoft: companies[0],
    waldTec: companies[1],
    deggendorfDigital: companies[2],
    donauLogistik: companies[3],
  };
}
