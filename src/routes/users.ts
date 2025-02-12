import { Elysia } from 'elysia'
import { t } from 'elysia'
import db from '../db'
import { table } from '../db/schema'
import { eq } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-typebox'
import { authorize } from './auth'
import { jwt } from '@elysiajs/jwt'
import { JWT_SECRET } from '../config/jwt'

const users = new Elysia({ prefix: '/users' })

const UserResponse = t.Object({
    id: t.Number(),
    username: t.String(),
    email: t.String({ format: 'email' }),
    createdAt: t.String()
})

const ErrorResponse = t.Object({
    error: t.String()
})

const createUserSchema = createInsertSchema(table.user)

users
    .use(jwt({ name: 'jwt', secret: JWT_SECRET }))
    .get('/', async ({ jwt, headers, set }) => {
        try {
            await authorize({ jwt, headers, set })
            
            const allUsers = await db
                .select({
                    id: table.user.id,
                    username: table.user.username,
                    email: table.user.email,
                    createdAt: table.user.createdAt
                })
                .from(table.user)
            
            return allUsers
        } catch (error) {
            set.status = 401
            return { error: error instanceof Error ? error.message : 'Unauthorized' }
        }
    }, {
        detail: {
            tags: ['Users'],
            summary: 'Get all users',
            responses: {
                '200': {
                    description: 'List of users',
                    content: {
                    }
                }
            }
        }
    })
    .get('/:id', async ({ params: { id } }) => {
        const user = await db
            .select({
                id: table.user.id,
                username: table.user.username,
                email: table.user.email,
                createdAt: table.user.createdAt
            })
            .from(table.user)
            .where(eq(table.user.id, parseInt(id)))
            .limit(1)

        if (!user.length) {
            throw new Error('User not found')
        }

        return user[0]
    }, {
        params: t.Object({
            id: t.String()
        }),
        detail: {
            tags: ['Users'],
            summary: 'Get user by ID',
            responses: {
                '200': {
                    description: 'User details',
                    content: {
                    }
                },
                '404': {
                    description: 'User not found',
                    content: {
                    }
                }
            }
        }
    })
    .post('/', async ({ body }) => {
        const salt = crypto.randomUUID()
        const newUser = await db
            .insert(table.user)
            .values({ ...body, salt })
            .returning({
                id: table.user.id,
                username: table.user.username,
                email: table.user.email,
                createdAt: table.user.createdAt
            })

        return newUser[0]
    }, {
        body: t.Omit(createUserSchema, ['id', 'createdAt']),
        detail: {
            tags: ['Users'],
            summary: 'Create new user',
            responses: {
                '200': {
                    description: 'User created successfully',
                    content: {
                    }
                },
                '400': {
                    description: 'Invalid input',
                    content: {
                    }
                }
            }
        }
    })

export default users 