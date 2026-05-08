import z from "zod";

export { ErrorSchema } from "../../schemas/common.js";

export const OrderBodySchema = z.object({
  employeeId: z.string(),
  orders: z.array(
    z.object({
      productId: z.string(),
      amount: z.number().int().positive(),
    }),
  ),
});

export const OrderResponseSchema = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      productId: z.string(),
      employeeId: z.string(),
      amount: z.number().int(),
      price: z.number(),
      createdAt: z.string(),
    }),
  ),
});

export type TOrderBody = z.infer<typeof OrderBodySchema>;
