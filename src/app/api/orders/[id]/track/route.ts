import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id: orderId } = await params

        const delivery = await prisma.delivery.findUnique({
            where: { orderId },
            select: {
                status: true,
                currentLocation: true,
                deliveryPerson: {
                    select: { name: true, phone: true }
                }
            }
        })

        if (!delivery) {
            return NextResponse.json({ success: false, error: 'Delivery not started' }, { status: 404 })
        }

        return NextResponse.json({ success: true, data: delivery })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 })
    }
}
