import db from '../index'
import { user } from '../schema'

export async function seed() {
    await db.insert(user).values([
        {
            username: 'admin',
            email: 'admin@example.com',
            password: 'hashed_password',
            salt: 'salt'
        }
    ])
} 