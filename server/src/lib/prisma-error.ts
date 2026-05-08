import { HTTPException } from 'hono/http-exception'
import { Prisma } from '../generated/prisma/client.js'

export function handlePrismaError(err: unknown): never {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        throw new HTTPException(409, { message: 'Resource already exists' })
      case 'P2025':
        throw new HTTPException(404, { message: 'Resource not found' })
      default:
        throw new HTTPException(500, { message: `Database error: ${err.code}` })
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    throw new HTTPException(400, { message: 'Invalid data provided' })
  }

  throw err
}
