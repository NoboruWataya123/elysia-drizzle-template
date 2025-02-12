import db from '../db'
import { table } from '../db/schema'

export const userService = {
    async findAll() {
        return db
            .select({
                id: table.user.id,
                username: table.user.username,
                email: table.user.email,
                createdAt: table.user.createdAt
            })
            .from(table.user)
    }
} 