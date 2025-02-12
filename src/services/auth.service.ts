import db from '../db'
import { table } from '../db/schema'
import { eq } from 'drizzle-orm'
import crypto from 'crypto'

export const authService = {
    async createUser(userData: any) {
        const salt = crypto.randomUUID()
        const hashedPassword = await Bun.password.hash(userData.password, {
            algorithm: "bcrypt",
            cost: 10,
        })

        const newUser = await db
            .insert(table.user)
            .values({ 
                ...userData, 
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
    },

    async validateUser(email: string, password: string) {
        const user = await db
            .select()
            .from(table.user)
            .where(eq(table.user.email, email))
            .limit(1)

        if (!user.length) return null

        const isValid = await Bun.password.verify(
            password,
            user[0].password,
            'bcrypt'
        )

        return isValid ? user[0] : null
    }
} 