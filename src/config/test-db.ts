import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from '../db/schema'

export const getTestDB = () => {
    const connectionString = process.env.TEST_DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/test_db'
    const client = postgres(connectionString)
    return drizzle(client, { schema })
} 