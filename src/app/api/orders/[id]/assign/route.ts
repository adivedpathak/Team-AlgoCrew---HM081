import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession()
    if (!session || session.role !== 'PHARMACIST') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id } = await params
        const { deliveryPersonId } = await request.json()

        // Create new delivery assignment
        await prisma.delivery.create({
            data: {
                orderId: id,
                deliveryPersonId,
                status: 'ASSIGNED',
                currentLocation: { lat: 27.7172, lng: 85.3240 } // Init default Kathmandu
            }
        })

        // Update order status
        await prisma.order.update({
            where: { id },
            data: { status: 'OUT_FOR_DELIVERY' } // Or ASSIGNED, depending on flow. Let's say OUT_FOR_DELIVERY starts immediately for simplicity 
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 })
    }
}
