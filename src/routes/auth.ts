import { Elysia, t } from 'elysia'
import { createInsertSchema } from 'drizzle-typebox'
import { table } from '../db/schema'
import db from '../db'
import crypto from 'crypto'
import { eq } from 'drizzle-orm'
import { jwt } from '@elysiajs/jwt'
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt'

const auth = new Elysia({ prefix: '/auth' })
    .use(jwt({
        name: 'jwt',
        secret: JWT_SECRET,
        exp: JWT_EXPIRES_IN
    }))

const SignUpResponse = t.Object({
    id: t.Number(),
    username: t.String(),
    email: t.String({ format: 'email' }),
    createdAt: t.String()
})

const ErrorResponse = t.Object({
    error: t.String()
})

const _createUser = createInsertSchema(table.user, {
    email: t.String({ format: 'email' }),
    username: t.String(),
    password: t.String()
})

const SignInBody = t.Object({
    email: t.String({ format: 'email' }),
    password: t.String()
})

auth.post('/sign-up', async ({ body, set }) => {
    try {
        const salt = crypto.randomUUID()
        const hashedPassword = await Bun.password.hash(body.password, {
            algorithm: "bcrypt",
            cost: 10,
        })

        const newUser = await db
            .insert(table.user)
            .values({ 
                ...body, 
                password: hashedPassword,
                salt 
            })
            .returning({
                id: table.user.id,
                username: table.user.username,
                email: table.user.email,
                createdAt: table.user.createdAt
            })

        return newUser[0]
    } catch (error) {
        console.error('Sign-up error:', error)
        
        const message = error instanceof Error ? error.message : 'Unknown error'
        
        if (message.includes('unique constraint')) {
            set.status = 400
            return { error: 'Username or email already exists' }
        }
        
        set.status = 500
        return { error: 'Internal Server Error' }
    }
}, {
    body: t.Omit(
        _createUser,
        ['id', 'salt', 'createdAt']
    ),
    detail: {
        tags: ['Authentication'],
        summary: 'Sign up new user',
        description: 'Create a new user account',
        responses: {
            '200': {
                description: 'User created successfully',
                content: {
                }
            },
            '400': {
                description: 'Invalid input or user already exists',
                content: {
                }
            }
        }
    }
})

auth
    .post('/sign-in', async ({ body, jwt }) => {
        const user = await db
            .select()
            .from(table.user)
            .where(eq(table.user.email, body.email))
            .limit(1)

        if (!user.length) {
            throw new Error('Invalid credentials')
        }

        const isValid = await Bun.password.verify(
            body.password,
            user[0].password,
            'bcrypt'
        )

        if (!isValid) {
            throw new Error('Invalid credentials')
        }

        const token = await jwt.sign({
            id: user[0].id,
            email: user[0].email
        })

        return {
            token,
            user: {
                id: user[0].id,
                username: user[0].username,
                email: user[0].email,
                createdAt: user[0].createdAt
            }
        }
    }, {
        body: SignInBody,
        detail: {
            tags: ['Authentication'],
            summary: 'Sign in user',
            description: 'Authenticate existing user',
            responses: {
                '200': {
                    description: 'Successfully authenticated',
                    content: {}
                },
                '400': {
                    description: 'Invalid credentials',
                    content: {}
                }
            }
        }
    })

// Middleware для защищенных маршрутов
const authorize = async ({ jwt, headers: { authorization } }: any) => {
    if (!authorization) {
        throw new Error('No token provided')
    }

    const token = authorization.split(' ')[1]
    const payload = await jwt.verify(token)

    if (!payload) {
        throw new Error('Invalid token')
    }

    return payload
}

export { authorize }
export default auth 