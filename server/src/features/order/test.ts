import { describe, it, expect, beforeAll } from 'vitest'
import { app } from '../../app.js'
import { prisma } from '../../lib/prisma.js'

const BASE = '/kiosk/orders'

describe('POST /orders', () => {
  let employeeId: string
  let productId: string

  beforeAll(async () => {
    const employee = await prisma.employee.findFirst()
    const product = await prisma.product.findFirst()
    employeeId = employee!.id
    productId = product!.id
  })

  it('201 - places order successfully', async () => {
    const res = await app.request(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeId,
        orders: [{ productId, amount: 2 }],
      }),
    })
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.data).toHaveLength(1)
    expect(body.data[0]).toMatchObject({
      employeeId,
      productId,
      amount: 2,
    })
    expect(typeof body.data[0].price).toBe('number')
    expect(typeof body.data[0].id).toBe('string')
  })

  it('201 - places multiple orders in one request', async () => {
    const secondProduct = await prisma.product.findFirst({ skip: 1 })
    const res = await app.request(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeId,
        orders: [
          { productId, amount: 1 },
          { productId: secondProduct!.id, amount: 3 },
        ],
      }),
    })
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.data).toHaveLength(2)
  })

  it('400 - missing employeeId', async () => {
    const res = await app.request(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orders: [{ productId, amount: 1 }],
      }),
    })
    expect(res.status).toBe(400)
  })

  it('400 - missing orders array', async () => {
    const res = await app.request(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId }),
    })
    expect(res.status).toBe(400)
  })

  it('400 - invalid amount (not positive)', async () => {
    const res = await app.request(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeId,
        orders: [{ productId, amount: 0 }],
      }),
    })
    expect(res.status).toBe(400)
  })

  it('404 - employee not found', async () => {
    const res = await app.request(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeId: 'nonexistent-employee-id',
        orders: [{ productId, amount: 1 }],
      }),
    })
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.error.message).toBe('Employee not found')
  })

  it('404 - product not found', async () => {
    const res = await app.request(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        employeeId,
        orders: [{ productId: 'nonexistent-product-id', amount: 1 }],
      }),
    })
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body.error.message).toContain('not found')
  })
})
