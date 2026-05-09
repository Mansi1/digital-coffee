import { z } from "zod";

export { ErrorSchema } from "../../../schemas/common.js";

export const AdminOrderSchema = z.object({
  id: z.string(),
  employeeId: z.string(),
  employeeName: z.string(),
  companyName: z.string(),
  productId: z.string(),
  productName: z.string(),
  amount: z.number().int(),
  price: z.number(),
  createdAt: z.string(),
});

export const AdminOrderListResponseSchema = z.object({
  data: z.array(AdminOrderSchema),
});

export const AdminOrderStatsSchema = z.object({
  data: z.object({
    topProducts: z.array(
      z.object({
        productId: z.string(),
        name: z.string(),
        totalAmount: z.number().int(),
      }),
    ),
    revenuePerMonth: z.array(
      z.object({
        month: z.string(),
        revenue: z.number(),
      }),
    ),
  }),
});

export const AdminOrderDeleteResponseSchema = z.object({
  data: z.object({ deleted: z.number().int() }),
});
