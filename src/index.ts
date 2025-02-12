import { Elysia } from 'elysia'
import auth from './routes/auth'
import users from './routes/users'
import { swagger } from '@elysiajs/swagger'

const app = new Elysia()
    .use(swagger({
        documentation: {
            info: {
                title: 'User Management API',
                version: '1.0.0',
                description: 'API for managing users and authentication'
            },
            tags: [
                { name: 'Authentication', description: 'Authentication endpoints' },
                { name: 'Users', description: 'User management endpoints' }
            ]
        }
    }))

app.group('/api/v1', app => app
    .use(auth)
    .use(users)
)

app.get('/', () => ({ message: 'Hello World' }))

app.listen(3000)

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)