import { describe, it, expect, beforeAll } from 'vitest'
import { app } from '../../app.js'
import { prisma } from '../../lib/prisma.js'
import { getAdminCookie } from '../../test/helper.js'

const LOGIN = '/admin/auth/login'
const INFO = '/admin/auth/info'
const LOGOUT = '/admin/auth/logout'

describe('Admin Auth Routes', () => {
  let adminId: string
  let userId: string

  beforeAll(async () => {
    const admin = await prisma.employee.findFirst({ where: { role: 'ADMIN' } })
    const user = await prisma.employee.findFirst({ where: { role: 'USER' } })
    adminId = admin!.id
    userId = user!.id
  })

  describe(`POST ${LOGIN}`, () => {
    it('200 - admin login setzt JWT cookie', async () => {
      const res = await app.request(LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: adminId, pin: '12345' }),
      })
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data).toMatchObject({ id: adminId, role: 'ADMIN' })
      expect(res.headers.get('set-cookie')).toContain('token=')
    })

    it('401 - falscher PIN', async () => {
      const res = await app.request(LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: adminId, pin: '00000' }),
      })
      expect(res.status).toBe(401)
    })

    it('401 - employee existiert nicht', async () => {
      const res = await app.request(LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: 'nonexistent-id', pin: '12345' }),
      })
      expect(res.status).toBe(401)
    })

    it('403 - kein Admin (USER Rolle)', async () => {
      const res = await app.request(LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: userId, pin: '12345' }),
      })
      expect(res.status).toBe(403)
    })

    it('400 - fehlende Felder', async () => {
      const res = await app.request(LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: adminId }),
      })
      expect(res.status).toBe(400)
    })
  })

  describe(`GET ${INFO}`, () => {
    it('200 - gibt Admin-Daten zurück wenn eingeloggt', async () => {
      const cookie = await getAdminCookie()
      const res = await app.request(INFO, {
        headers: { Cookie: cookie },
      })
      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data).toMatchObject({ id: adminId, role: 'ADMIN' })
    })

    it('401 - kein Cookie', async () => {
      const res = await app.request(INFO)
      expect(res.status).toBe(401)
    })

    it('401 - ungültiger Token', async () => {
      const res = await app.request(INFO, {
        headers: { Cookie: 'token=this.is.invalid' },
      })
      expect(res.status).toBe(401)
    })
  })

  describe(`POST ${LOGOUT}`, () => {
    it('200 - löscht JWT cookie', async () => {
      const cookie = await getAdminCookie()
      const res = await app.request(LOGOUT, {
        method: 'POST',
        headers: { Cookie: cookie },
      })
      expect(res.status).toBe(200)
      expect(res.headers.get('set-cookie')).toContain('token=')
    })

    it('200 - auch ohne aktive Session', async () => {
      const res = await app.request(LOGOUT, { method: 'POST' })
      expect(res.status).toBe(200)
    })
  })
})
