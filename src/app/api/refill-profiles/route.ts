import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const profiles = await prisma.refillProfile.findMany({
            where: { customerId: session.userId },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json({ success: true, data: profiles })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { name, medicines, frequency, nextRefillDate } = await request.json()

        const profile = await prisma.refillProfile.create({
            data: {
                customerId: session.userId,
                name,
                medicines, // Expecting JSON array of { name, quantity }
                frequency: parseInt(frequency),
                nextRefillDate: new Date(nextRefillDate),
                isActive: true
            }
        })
        return NextResponse.json({ success: true, data: profile })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 })
    }
}
