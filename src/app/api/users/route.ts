import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
    const session = await getSession()
    if (!session || session.role !== 'PHARMACIST') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')

    try {
        const users = await prisma.user.findMany({
            where: { role: role === 'DELIVERY' ? 'DELIVERY' : undefined },
            select: { id: true, name: true, email: true }
        })
        return NextResponse.json({ success: true, data: users })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 })
    }
}
