import { describe, it, expect, beforeAll, afterEach } from 'vitest'
import { app } from '../../app.js'
import { prisma } from '../../lib/prisma.js'

const REGISTER = '/kiosk/register'

describe(`POST ${REGISTER}`, () => {
  let companyId: string

  beforeAll(async () => {
    const company = await prisma.company.findFirst()
    companyId = company!.id
  })

  afterEach(async () => {
    await prisma.employee.deleteMany({ where: { email: 'new@test.com' } })
  })

  it('201 - registriert Employee mit eigenem PIN', async () => {
    const res = await app.request(REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Max Neu', email: 'new@test.com', companyId, pin: '99999' }),
    })
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.data).toMatchObject({ email: 'new@test.com', role: 'USER', companyId })
    expect(body.data).toHaveProperty('id')
  })

  it('201 - registriert Employee ohne PIN (wird automatisch generiert)', async () => {
    const res = await app.request(REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Max Neu', email: 'new@test.com', companyId }),
    })
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.data).toMatchObject({ email: 'new@test.com', companyId })
  })

  it('409 - Email bereits vergeben', async () => {
    await app.request(REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Max Neu', email: 'new@test.com', companyId }),
    })
    const res = await app.request(REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Max Neu Doppelt', email: 'new@test.com', companyId }),
    })
    expect(res.status).toBe(409)
    const body = await res.json()
    expect(body.error.message).toContain('already exists')
  })

  it('404 - Company existiert nicht', async () => {
    const res = await app.request(REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Max Neu', email: 'new@test.com', companyId: 'nonexistent-company-id' }),
    })
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.error.message).toContain('Company not found')
  })

  it('400 - Name fehlt', async () => {
    const res = await app.request(REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'new@test.com', companyId }),
    })
    expect(res.status).toBe(400)
  })

  it('400 - Email fehlt', async () => {
    const res = await app.request(REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Max Neu', companyId }),
    })
    expect(res.status).toBe(400)
  })

  it('400 - ungültiges Email-Format', async () => {
    const res = await app.request(REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Max Neu', email: 'kein-email', companyId }),
    })
    expect(res.status).toBe(400)
  })

  it('400 - companyId fehlt', async () => {
    const res = await app.request(REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Max Neu', email: 'new@test.com' }),
    })
    expect(res.status).toBe(400)
  })

  it('400 - PIN zu kurz (weniger als 5 Stellen)', async () => {
    const res = await app.request(REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Max Neu', email: 'new@test.com', companyId, pin: '123' }),
    })
    expect(res.status).toBe(400)
  })

  it('400 - PIN zu lang (mehr als 5 Stellen)', async () => {
    const res = await app.request(REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Max Neu', email: 'new@test.com', companyId, pin: '123456' }),
    })
    expect(res.status).toBe(400)
  })
})
