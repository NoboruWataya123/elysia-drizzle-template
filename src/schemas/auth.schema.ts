import { t } from 'elysia'
import { createInsertSchema } from 'drizzle-typebox'
import { table } from '../db/schema'

export const SignUpResponse = t.Object({
    id: t.Number(),
    username: t.String(),
    email: t.String({ format: 'email' }),
    createdAt: t.String()
})

export const ErrorResponse = t.Object({
    error: t.String()
})

export const CreateUserSchema = createInsertSchema(table.user, {
    email: t.String({ format: 'email' }),
    username: t.String(),
    password: t.String()
})

export const SignInSchema = t.Object({
    email: t.String({ format: 'email' }),
    password: t.String()
}) 