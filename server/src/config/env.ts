import 'dotenv/config'
import { z } from 'zod'

const schema = z.object({
  DATABASE: z.url(),
  JWT_SECRET: z.string().min(16),
  CORS_ORIGIN: z.url(),
  PORT: z.coerce.number().default(3000),
})

const envServer = schema.safeParse(process.env)

if (!envServer.success) {
  console.error('❌ Ungültige Umgebungsvariablen:', envServer.error.message)
  process.exit(1)
}

export const env = envServer.data
