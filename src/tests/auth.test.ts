import { describe, expect, it, beforeAll } from 'bun:test'
import { Elysia } from 'elysia'
import auth from '../routes/auth'
import db from '../db'
import { table } from '../db/schema'
import { eq } from 'drizzle-orm'

describe('Auth Routes', () => {
    const app = new Elysia().use(auth)

    beforeAll(async () => {
        // Очищаем таблицу пользователей перед тестами (удали только testuser)
        await db.delete(table.user).where(eq(table.user.username, 'testuser'))
    })

    it('should sign up a new user', async () => {
        const response = await app.handle(
            new Request('http://localhost/auth/sign-up', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: 'testuser',
                    email: 'test@test.com',
                    password: 'password123'
                })
            })
        )

        expect(response.status).toBe(200)
        const data = await response.json()
        expect(data.username).toBe('testuser')
        expect(data.email).toBe('test@test.com')
    })

    it('should not allow duplicate usernames', async () => {
        const response = await app.handle(
            new Request('http://localhost/auth/sign-up', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: 'testuser',
                    email: 'another@test.com',
                    password: 'password123'
                })
            })
        )

        expect(response.status).toBe(400)
        const data = await response.json()
        expect(data.error).toBeDefined()
    })

    it('should sign in user', async () => {
        const response = await app.handle(
            new Request('http://localhost/auth/sign-in', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'test@test.com',
                    password: 'password123'
                })
            })
        )

        expect(response.status).toBe(200)
        const data = await response.json()
        expect(data.token).toBeDefined()
        expect(data.user.username).toBe('testuser')
    })
}) 