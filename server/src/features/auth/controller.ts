import type { Context } from "hono";
import { AuthService } from "./service.js";

export class AuthController {
  static async identify(c: Context) {
    const { employeeId, pin } = c.req.valid("json" as never);
    const employee = await AuthService.identifyEmployee(employeeId, pin);
    return c.json({ data: employee }, 200);
  }

  static async register(c: Context) {
    const { name, email, companyId, pin } = c.req.valid("json" as never);
    const employee = await AuthService.registerEmployee({
      name,
      email,
      companyId,
      pin,
    });
    return c.json({ data: employee }, 201);
  }
}
