import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
    const session = await getSession()
    if (!session || session.role !== 'PHARMACIST') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const prescriptions = await prisma.prescription.findMany({
            where: { status: 'PENDING' },
            include: { customer: true },
            orderBy: { createdAt: 'asc' }
        })

        return NextResponse.json({ success: true, data: prescriptions })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 })
    }
}
