import { Elysia } from 'elysia'
import { authService } from '../services/auth.service'
import { authMiddleware } from '../middleware/auth'
import { CreateUserSchema, SignInSchema } from '../schemas/auth.schema'

const auth = new Elysia({ prefix: '/auth' })
    .use(authMiddleware)

auth.post('/sign-up', async ({ body, set }) => {
    try {
        const user = await authService.createUser(body)
        return user
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        
        if (message.includes('unique constraint')) {
            set.status = 400
            return { error: 'Username or email already exists' }
        }
        
        set.status = 500
        return { error: 'Internal Server Error' }
    }
}, {
    body: CreateUserSchema
})

auth.post('/sign-in', async ({ body, jwt }) => {
    const user = await authService.validateUser(body.email, body.password)
    
    if (!user) {
        throw new Error('Invalid credentials')
    }

    const token = await jwt.sign({
        id: user.id,
        email: user.email
    })

    return {
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt
        }
    }
}, {
    body: SignInSchema
})

export default auth 