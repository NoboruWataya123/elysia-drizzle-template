import { JWT_SECRET } from '../config/jwt'
import { jwt } from '@elysiajs/jwt'
import { Elysia } from 'elysia'

export const authMiddleware = new Elysia()
    .use(jwt({ name: 'jwt', secret: JWT_SECRET }))

export const authorize = async ({ jwt, headers: { authorization }, set }: any) => {
    if (!authorization) {
        set.status = 401
        throw new Error('No token provided')
    }

    const token = authorization.split(' ')[1]
    const payload = await jwt.verify(token)

    if (!payload) {
        set.status = 401
        throw new Error('Invalid token')
    }

    return payload
} 