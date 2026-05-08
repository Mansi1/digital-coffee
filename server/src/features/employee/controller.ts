import { Context } from "hono";
import { EmployeeService } from "./service.js";

export class EmployeeController {
  static async getAll(c: Context) {
    const employees = await EmployeeService.getAll();
    return c.json({ data: employees });
  }
}
