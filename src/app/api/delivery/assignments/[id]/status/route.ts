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
        const { status } = await request.json() // PICKED_UP, IN_TRANSIT, DELIVERED

        // Update delivery status
        const delivery = await prisma.delivery.update({
            where: { id },
            data: { status }
        })

        // Sync order status
        let orderStatus = 'OUT_FOR_DELIVERY'
        if (status === 'DELIVERED') orderStatus = 'DELIVERED'

        await prisma.order.update({
            where: { id: delivery.orderId },
            data: { status: orderStatus as any }
        })

        return NextResponse.json({ success: true, data: delivery })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 })
    }
}
