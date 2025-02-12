import { relations } from 'drizzle-orm'
import {
    pgTable,
    varchar,
    timestamp,
    serial
} from 'drizzle-orm/pg-core'

export const user = pgTable(
    'user',
    {
        id: serial('id').primaryKey(),
        username: varchar('username').notNull().unique(),
        password: varchar('password').notNull(),
        email: varchar('email').notNull().unique(),
        salt: varchar('salt', { length: 64 }).notNull(),
        createdAt: timestamp('created_at').defaultNow().notNull(),
    }
)

export const table = {
	user
} as const

export type User = typeof user.$inferSelect
export type Table = typeof table