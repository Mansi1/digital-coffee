import { hash, verify } from "argon2";
import { HTTPException } from "hono/http-exception";
import { prisma } from "../../lib/prisma.js";
import { createRandomPin } from "../../utils/employeeUtils.js";

export class AuthService {
  public static async identifyEmployee(employeeId: string, pin: string) {
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new HTTPException(401, { message: "Invalid credentials" });
    }

    const valid = await verify(employee.pin, pin);
    if (!valid) {
      throw new HTTPException(401, { message: "Invalid credentials" });
    }

    return {
      id: employee.id,
      email: employee.email,
      role: employee.role,
      companyId: employee.companyId,
    };
  }

  static async registerEmployee({
    name,
    email,
    companyId,
    pin,
  }: {
    name: string;
    email: string;
    companyId: string;
    pin: string | undefined;
  }) {
    const existingEmployee = await prisma.employee.findUnique({ where: { email } });
    if (existingEmployee) {
      throw new HTTPException(409, { message: "Employee with this email already exists" });
    }

    const company = await prisma.company.findUnique({ where: { id: companyId } });
    if (!company) {
      throw new HTTPException(404, { message: "Company not found" });
    }

    const generatedPin = pin ?? createRandomPin();

    const newEmployee = await prisma.employee.create({
      data: { name, email, companyId, pin: await hash(generatedPin) },
    });

    return {
      id: newEmployee.id,
      email: newEmployee.email,
      role: newEmployee.role,
      companyId: newEmployee.companyId,
    };
  }
}
