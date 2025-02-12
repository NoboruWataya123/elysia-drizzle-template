export interface JWTPayload {
    id: number
    email: string
    iat?: number
    exp?: number
}

export interface APIResponse<T> {
    data?: T
    error?: string
    meta?: {
        page?: number
        limit?: number
        total?: number
    }
} 