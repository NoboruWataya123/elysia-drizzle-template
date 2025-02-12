import { describe, expect, it, beforeAll } from 'bun:test'
import { Elysia } from 'elysia'
import users from '../routes/users'
import { createTestToken } from '../utils/test-helpers'
import db from '../db'
import { table } from '../db/schema'

describe('Users Routes', () => {
    const app = new Elysia().use(users)
    const token = createTestToken({ id: 1, email: 'test@test.com' })

    beforeAll(async () => {
        // Создаем тестового пользователя
        await db.insert(table.user).values({
            username: 'testuser',
            email: 'test@test.com',
            password: 'hashedpassword',
            salt: 'testsalt'
        }).onConflictDoNothing()
    })

    it('should get all users with valid token', async () => {
        const response = await app.handle(
            new Request('http://localhost/users', {
                method: 'GET',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
        )

        const data = await response.json()
        expect(response.status).toBe(200)
        expect(Array.isArray(data)).toBe(true)
    })

    it('should reject without token', async () => {
        const response = await app.handle(
            new Request('http://localhost/users', {
                method: 'GET'
            })
        )

        expect(response.status).toBe(401)
    })
}) 