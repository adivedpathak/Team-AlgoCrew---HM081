import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import { z } from 'zod'

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string(),
    phone: z.string(),
    role: z.enum(['CUSTOMER', 'PHARMACIST', 'DELIVERY']),
    address: z.any().optional(),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password, name, phone, role, address } = registerSchema.parse(body)

        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json({ success: false, error: 'User already exists' }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone,
                role: role as any,
                address: address || {},
            },
        })

        const { password: _, ...userWithoutPassword } = user

        return NextResponse.json({ success: true, data: userWithoutPassword })
    } catch (error: any) {
        console.error('Registration Error:', error)
        return NextResponse.json({ success: false, error: error.message || 'Registration failed' }, { status: 500 })
    }
}
