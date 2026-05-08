import { describe, expect, it } from 'vitest'
import { app } from '../../app.js'
import { prisma } from '../../lib/prisma.js'
import { getAuthCookie } from '../../test/helper.js'

describe('Todos', () => {
  describe('GET /todos', () => {
    it('should return 200 with all todos for the logged-in user', async () => {
      const cookie = await getAuthCookie('USER')
      const user = await prisma.user.findUnique({
        where: {
          email: 'user@devroots.de',
        },
      })

      if (!user) {
        throw new Error('Test user not found')
      }

      const res = await app.request('/todos', {
        method: 'GET',
        headers: { Cookie: cookie },
      })

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data).toBeInstanceOf(Array)
      expect(body.data.length).toBeGreaterThan(0)
      expect(body.data[0]).toHaveProperty('id')
      expect(body.data[0]).toHaveProperty('title')

      expect(body.data.every((todo: { userId: string }) => todo.userId === user.id)).toBe(true)
    })

    it('should return 401 without auth cookie', async () => {
      const res = await app.request('/todos', {
        method: 'GET',
      })
      expect(res.status).toBe(401)
    })

    it('should return 403 if user does not have permission', async () => {
      const cookie = await getAuthCookie('NONE')

      const res = await app.request('/todos', {
        method: 'GET',
        headers: { Cookie: cookie },
      })
      expect(res.status).toBe(403)
    })
  })

  describe('GET /todos/:id', () => {
    it('should return 200 with the requested todo', async () => {
      const cookie = await getAuthCookie('USER')

      // First create a todo to fetch
      const createRes = await app.request('/todos', {
        method: 'POST',
        headers: { Cookie: cookie, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Todo to Fetch' }),
      })
      const createdTodo = await createRes.json()

      // Now fetch the created todo
      const getRes = await app.request(`/todos/${createdTodo.data.id}`, {
        method: 'GET',
        headers: { Cookie: cookie },
      })

      expect(getRes.status).toBe(200)
      const body = await getRes.json()
      expect(body.data).toHaveProperty('id')
      expect(body.data.title).toBe('Todo to Fetch')

      // Cleanup
      await prisma.todo.delete({
        where: {
          id: body.data.id,
        },
      })
    })

    it('should return 404 if todo is not found', async () => {
      const cookie = await getAuthCookie('USER')

      const res = await app.request('/todos/-1', {
        method: 'GET',
        headers: { Cookie: cookie },
      })
      expect(res.status).toBe(404)
    })

    it('should return 401 without auth cookie', async () => {
      const res = await app.request('/todos/1', {
        method: 'GET',
      })
      expect(res.status).toBe(401)
    })

    it('should return 403 if user does not have permission', async () => {
      const cookie = await getAuthCookie('NONE')

      const res = await app.request('/todos/1', {
        method: 'GET',
        headers: { Cookie: cookie },
      })
      expect(res.status).toBe(403)
    })
  })

  describe('POST /todos', () => {
    it('should create a new todo', async () => {
      const cookie = await getAuthCookie('USER')

      const res = await app.request('/todos', {
        method: 'POST',
        headers: { Cookie: cookie, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Todo' }),
      })

      expect(res.status).toBe(201)
      const body = await res.json()
      expect(body.data).toHaveProperty('id')
      expect(body.data.title).toBe('New Todo')

      // Cleanup
      await prisma.todo.delete({
        where: {
          id: body.data.id,
        },
      })
    })

    it('should return 400 with invalid body', async () => {
      const cookie = await getAuthCookie('USER')

      const res = await app.request('/todos', {
        method: 'POST',
        headers: { Cookie: cookie, 'Content-Type': 'application/json' },
        body: JSON.stringify({ invalidField: 'Invalid' }),
      })

      expect(res.status).toBe(400)
    })

    it('should return 401 without auth cookie', async () => {
      const res = await app.request('/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Todo' }),
      })
      expect(res.status).toBe(401)
    })

    it('should return 403 if user does not have permission', async () => {
      const cookie = await getAuthCookie('NONE')

      const res = await app.request('/todos', {
        method: 'POST',
        headers: { Cookie: cookie, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Todo' }),
      })
      expect(res.status).toBe(403)
    })
  })

  describe('PATCH /todos', () => {
    it('should update a todo', async () => {
      const cookie = await getAuthCookie('USER')

      // First create a todo to update
      const createRes = await app.request('/todos', {
        method: 'POST',
        headers: { Cookie: cookie, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Todo to Update' }),
      })
      const createdTodo = await createRes.json()

      // Now update the created todo
      const updateRes = await app.request(`/todos/${createdTodo.data.id}`, {
        method: 'PATCH',
        headers: { Cookie: cookie, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated Todo', isCompleted: true }),
      })

      expect(updateRes.status).toBe(200)
      const body = await updateRes.json()
      expect(body.data.title).toBe('Updated Todo')
      expect(body.data.isCompleted).toBe(true)

      // Cleanup
      await prisma.todo.delete({
        where: {
          id: body.data.id,
        },
      })
    })

    it('should return 404 if todo is not found', async () => {
      const cookie = await getAuthCookie('USER')

      const res = await app.request('/todos/-1', {
        method: 'PATCH',
        headers: { Cookie: cookie, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated Todo', isCompleted: true }),
      })
      expect(res.status).toBe(404)
    })

    it('should return 400 with invalid body', async () => {
      const cookie = await getAuthCookie('USER')

      // First create a todo to update
      const createRes = await app.request('/todos', {
        method: 'POST',
        headers: { Cookie: cookie, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Todo to Update' }),
      })
      const createdTodo = await createRes.json()

      // Now try to update with invalid body (empty title fails min(1))
      const updateRes = await app.request(`/todos/${createdTodo.data.id}`, {
        method: 'PATCH',
        headers: { Cookie: cookie, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: '' }),
      })

      expect(updateRes.status).toBe(400)

      // Cleanup
      await prisma.todo.delete({
        where: {
          id: createdTodo.data.id,
        },
      })
    })

    it('should return 401 without auth cookie', async () => {
      const res = await app.request('/todos/1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated Todo', isCompleted: true }),
      })
      expect(res.status).toBe(401)
    })

    it('should return 403 if user does not have permission', async () => {
      const cookie = await getAuthCookie('NONE')

      const res = await app.request('/todos/1', {
        method: 'PATCH',
        headers: { Cookie: cookie, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated Todo', isCompleted: true }),
      })
      expect(res.status).toBe(403)
    })

    it('should return 403 if user does not have permission to patch their own todo', async () => {
      const noneCookie = await getAuthCookie('NONE')

      const user = await prisma.user.findUnique({ where: { email: 'user@devroots.de' } })
      if (!user) throw new Error('Test user not found')

      const createdTodo = await prisma.todo.create({
        data: { title: `Todo to Update ${Date.now()}`, userId: user.id },
      })

      const res = await app.request(`/todos/${createdTodo.id}`, {
        method: 'PATCH',
        headers: { Cookie: noneCookie, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated Todo', isCompleted: true }),
      })
      expect(res.status).toBe(403)

      // Cleanup
      await prisma.todo.delete({ where: { id: createdTodo.id } })
    })
  })

  describe('DELETE /todos/:id', () => {
    it('should delete a todo', async () => {
      const cookie = await getAuthCookie('ADMIN')

      // First create a todo to delete
      const createRes = await app.request('/todos', {
        method: 'POST',
        headers: { Cookie: cookie, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Todo to Delete' }),
      })
      const createdTodo = await createRes.json()

      // Now delete the created todo
      const deleteRes = await app.request(`/todos/${createdTodo.data.id}`, {
        method: 'DELETE',
        headers: { Cookie: cookie },
      })

      expect(deleteRes.status).toBe(200)

      // Verify the todo is deleted
      const getRes = await app.request(`/todos/${createdTodo.data.id}`, {
        method: 'GET',
        headers: { Cookie: cookie },
      })
      expect(getRes.status).toBe(404)
    })

    it('should return 403 if user does not have permission to delete', async () => {
      const cookie = await getAuthCookie('USER')

      const admin = await prisma.user.findUnique({ where: { email: 'admin@devroots.de' } })
      if (!admin) throw new Error('Admin user not found')

      const todo = await prisma.todo.create({
        data: { title: 'Todo to Delete by User', userId: admin.id },
      })

      const res = await app.request(`/todos/${todo.id}`, {
        method: 'DELETE',
        headers: { Cookie: cookie },
      })
      expect(res.status).toBe(403)

      // Cleanup
      await prisma.todo.delete({ where: { id: todo.id } })
    })

    it('should return 401 without auth cookie', async () => {
      const res = await app.request('/todos/1', {
        method: 'DELETE',
      })
      expect(res.status).toBe(401)
    })
  })

  describe('Cross-user access', () => {
    it('should return 404 when accessing another user todo by id', async () => {
      const adminCookie = await getAuthCookie('ADMIN')
      const userCookie = await getAuthCookie('USER')

      // Admin creates a todo
      const createRes = await app.request('/todos', {
        method: 'POST',
        headers: { Cookie: adminCookie, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Admin private todo' }),
      })
      const { data: adminTodo } = await createRes.json()

      // User tries to access admin's todo
      const res = await app.request(`/todos/${adminTodo.id}`, {
        method: 'GET',
        headers: { Cookie: userCookie },
      })
      expect(res.status).toBe(404)

      // Cleanup
      await prisma.todo.delete({ where: { id: adminTodo.id } })
    })
  })
})
