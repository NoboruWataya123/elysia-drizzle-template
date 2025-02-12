import { t } from 'elysia'

export const UserResponse = t.Object({
    id: t.Number(),
    username: t.String(),
    email: t.String({ format: 'email' }),
    createdAt: t.String()
}) 