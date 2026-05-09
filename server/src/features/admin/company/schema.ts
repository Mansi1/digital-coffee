import { z } from "zod";

export { ErrorSchema } from "../../../schemas/common.js";

export const AdminCompanySchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  createdAt: z.string(),
  deactivatedAt: z.string().nullable(),
});

export const AdminCompanyCreateSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});

export const AdminCompanyUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.email().optional(),
});

export const AdminCompanyListResponseSchema = z.object({
  data: z.array(AdminCompanySchema),
});

export const AdminCompanyResponseSchema = z.object({
  data: AdminCompanySchema,
});

export type TAdminCompanyCreate = z.infer<typeof AdminCompanyCreateSchema>;
export type TAdminCompanyUpdate = z.infer<typeof AdminCompanyUpdateSchema>;
