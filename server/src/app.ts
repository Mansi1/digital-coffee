import 'dotenv/config'
import { OpenAPIHono } from '@hono/zod-openapi'
import { apiReference } from '@scalar/hono-api-reference'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { adminAuthRoutes } from './features/admin/auth/routes.js'
import { adminProductRoutes } from './features/admin/product/routes.js'
import { kioskRoutes } from './features/kiosk/routes.js'
import { notFound, onError } from './middleware/error-handler.js'

export const app = new OpenAPIHono()

app.use('*', logger())
app.use('*', cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:9000', credentials: true }))
app.onError(onError)
app.notFound(notFound)

app.get('/', (c) => c.json({ message: 'API is running' }))

app.route('/kiosk', kioskRoutes)
app.route('/admin/auth', adminAuthRoutes)
app.route('/admin/products', adminProductRoutes)

app.doc('/openapi.json', {
  openapi: '3.0.0',
  info: {
    title: 'Digital Coffee API',
    version: '1.0.0',
    description: 'Kiosk ordering and admin management',
  },
})

app.get('/docs', apiReference({ url: '/openapi.json' }))
