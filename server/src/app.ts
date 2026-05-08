import 'dotenv/config'
import { OpenAPIHono } from '@hono/zod-openapi'
import { apiReference } from '@scalar/hono-api-reference'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { authRoutes } from './features/auth/routes.js'
import { todosRoutes } from './features/todos/routes.js'
import { notFound, onError } from './middleware/error-handler.js'
import { jwtAuth } from './middleware/jwt-auth.js'

export const app = new OpenAPIHono()

app.use('*', logger())
app.use(
  '*',
  cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:9000', credentials: true }),
)
app.use('*', jwtAuth)
app.onError(onError)
app.notFound(notFound)

app.get('/', (c) => c.json({ message: 'API is running' }))

app.route('/auth', authRoutes)
app.route('/todos', todosRoutes)

app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    title: 'REST API',
    version: '1.0.0',
    description: 'REST TypeScript Template API',
  },
})

app.get(
  '/docs',
  apiReference({
    url: '/openapi.json',
  }),
)
