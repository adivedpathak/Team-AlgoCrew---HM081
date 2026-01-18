import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'secret'
const EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export interface JWTPayload {
    userId: string
    email: string
    role: string
}

export function signToken(payload: JWTPayload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN as any })
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload & { iat: number; exp: number }
    } catch (error) {
        return null
    }
}

export async function getSession() {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    if (!token) return null

    return verifyToken(token)
}
