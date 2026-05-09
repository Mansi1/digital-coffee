import { z } from "zod";

export { ErrorSchema } from "../../../schemas/common.js";

export const AdminEmployeeSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.enum(["USER", "ADMIN", "NONE"]),
  companyId: z.string(),
  company: z.object({ name: z.string() }),
  createdAt: z.string(),
  deactivatedAt: z.string().nullable(),
});

export const AdminEmployeeUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.enum(["USER", "ADMIN", "NONE"]).optional(),
});

export const AdminEmployeeListResponseSchema = z.object({
  data: z.array(AdminEmployeeSchema),
});

export const AdminEmployeeResponseSchema = z.object({
  data: AdminEmployeeSchema,
});

export type TAdminEmployeeUpdate = z.infer<typeof AdminEmployeeUpdateSchema>;
