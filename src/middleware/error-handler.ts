import { Elysia } from 'elysia'

export const errorHandler = new Elysia()
    .onError(({ code, error, set }) => {
        switch (code) {
            case 'NOT_FOUND':
                set.status = 404
                return { error: 'Not Found' }
            case 'VALIDATION':
                set.status = 400
                return { error: error.message }
            case 'INTERNAL_SERVER_ERROR':
                set.status = 401
                return { error: 'Unauthorized' }
            default:
                set.status = 500
                return { error: 'Internal Server Error' }
        }
    }) 