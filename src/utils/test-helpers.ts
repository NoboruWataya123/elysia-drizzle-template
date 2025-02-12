import { JWT_SECRET } from '../config/jwt'
import jsonwebtoken from 'jsonwebtoken'
import { JWTPayload } from '../types'

export const createTestToken = (payload: Partial<JWTPayload>) => {
    return jsonwebtoken.sign(payload, JWT_SECRET)
} 