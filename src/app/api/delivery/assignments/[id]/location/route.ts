import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession()
    if (!session || session.role !== 'DELIVERY') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id } = await params
        const { lat, lng } = await request.json()

        const delivery = await prisma.delivery.update({
            where: { id },
            data: {
                currentLocation: { lat, lng }
            }
        })

        return NextResponse.json({ success: true, data: delivery })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Location update failed' }, { status: 500 })
    }
}
