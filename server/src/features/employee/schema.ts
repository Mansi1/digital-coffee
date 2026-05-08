import z from "zod";

export const EmployeeResponseSchema = z.object({
  data: z.array(
    z.object({
      name: z.string(),
      company: z.object({
        name: z.string(),
      }),
    }),
  ),
});

export type TEmployeeResponse = z.infer<typeof EmployeeResponseSchema>;
