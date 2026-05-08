import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'

export function onError(err: Error, c: Context) {
  if (err instanceof HTTPException) {
    return c.json({ error: { code: 'HTTP_ERROR', message: err.message } }, err.status)
  }

  console.error(err)
  return c.json({ error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } }, 500)
}

export function notFound(c: Context) {
  return c.json(
    { error: { code: 'NOT_FOUND', message: `Route ${c.req.method} ${c.req.path} not found` } },
    404,
  )
}
