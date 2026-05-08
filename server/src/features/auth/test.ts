import { app } from '../../app.js'
import { getAuthCookie } from '../../test/helper.js'

describe('Auth Routes', () => {
  describe('POST /auth/login', () => {
    it('should return 200 with valid credentials', async () => {
      const res = await app.request('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@devroots.de', password: 'admin1234' }),
      })

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.data).toHaveProperty('id')
      expect(body.data).toHaveProperty('email')
      expect(body.data).toHaveProperty('role')
    })

    it('should return 401 with wrong password', async () => {
      const res = await app.request('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@devroots.de', password: 'wrongpassword' }),
      })

      expect(res.status).toBe(401)
    })

    it('should return 400 with invalid email', async () => {
      const res = await app.request('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'not-an-email', password: 'admin1234' }),
      })

      expect(res.status).toBe(400)
    })

    it('should return 400 with missing fields', async () => {
      const res = await app.request('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@devroots;de' }), // Missing password
      })

      expect(res.status).toBe(400)
    })

    it('should return 401 for non-existent user', async () => {
      const res = await app.request('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@devroots.de', password: 'admin1234' }),
      })

      expect(res.status).toBe(401)
    })

    it('should set jwt cookie on successful login', async () => {
      const res = await app.request('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@devroots.de', password: 'admin1234' }),
      })

      expect(res.status).toBe(200)
      const cookies = res.headers.get('set-cookie')
      expect(cookies).toBeTruthy()
      expect(cookies).toContain('token=') // Assuming the cookie is named 'jwt'
    })
  })

  describe('POST /auth/logout', () => {
    it('should return 200 and clear the token cookie', async () => {
      const res = await app.request('/auth/logout', { method: 'POST' })

      expect(res.status).toBe(200)
      const cookies = res.headers.get('set-cookie')
      expect(cookies).toContain('token=')
      expect(cookies).toContain('Max-Age=0')
    })

    it('should return 200 even without an active session', async () => {
      const res = await app.request('/auth/logout', { method: 'POST' })

      expect(res.status).toBe(200)
    })
  })

  describe('GET /auth/me', () => {
    it('should return 200 with user data when authenticated as USER', async () => {
      const cookie = await getAuthCookie('USER')

      const res = await app.request('/auth/me', {
        headers: { Cookie: cookie },
      })

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.user).toHaveProperty('id')
      expect(body.user).toHaveProperty('email')
      expect(body.user).toHaveProperty('role')
    })

    it('should return 200 with user data when authenticated as ADMIN', async () => {
      const cookie = await getAuthCookie('ADMIN')

      const res = await app.request('/auth/me', {
        headers: { Cookie: cookie },
      })

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(body.user.role).toBe('ADMIN')
    })

    it('should return 401 when no cookie is sent', async () => {
      const res = await app.request('/auth/me')

      expect(res.status).toBe(401)
    })

    it('should return 401 when token cookie is invalid', async () => {
      const res = await app.request('/auth/me', {
        headers: { Cookie: 'token=this.is.not.a.valid.jwt' },
      })

      expect(res.status).toBe(401)
    })

    it('should return 401 after logout (cleared cookie)', async () => {
      const res = await app.request('/auth/me', {
        headers: { Cookie: 'token=' },
      })

      expect(res.status).toBe(401)
    })
  })

  describe('POST /auth/register', () => {
    it('should return 201 with valid data', async () => {
      const res = await app.request('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@devroots.de',
          password: 'test1234',
        }),
      })

      expect(res.status).toBe(201)
    })

    it('should return 409 if user already exists', async () => {
      const res = await app.request('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@devroots.de',
          password: 'admin1234',
        }),
      })

      expect(res.status).toBe(409)
    })

    it('should return 400 with invalid email', async () => {
      const res = await app.request('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'not-an-email', password: 'test1234' }),
      })

      expect(res.status).toBe(400)
    })

    it('should return 400 with missing fields', async () => {
      const res = await app.request('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@devroots.de' }), // Missing password
      })

      expect(res.status).toBe(400)
    })
  })
})
