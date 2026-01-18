import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { items, total, address } = await request.json()

        // Validation: Check for Prescription items
        const hasRxItems = items.some((i: any) => i.requiresPrescription)
        if (hasRxItems) {
            // Check if user has any recent prescription (Pending or Verified)
            const hasPrescription = await prisma.prescription.findFirst({
                where: {
                    customerId: session.userId,
                    createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
                }
            })

            if (!hasPrescription) {
                return NextResponse.json({
                    success: false,
                    error: 'Prescription required for some items. Please upload a prescription first.'
                }, { status: 400 })
            }
        }
        const orderNumber = `ORD-${Date.now()}`

        const order = await prisma.$transaction(async (tx) => {
            // Check stock first
            for (const item of items) {
                const stock = await tx.inventory.findFirst({
                    where: { medicineId: item.id }
                })
                if (!stock || stock.quantity < item.quantity) {
                    throw new Error(`Insufficient stock for item ${item.name}`)
                }
            }

            // Create Order
            const newOrder = await tx.order.create({
                data: {
                    orderNumber,
                    customerId: session.userId,
                    deliveryAddress: address || { street: "123 Main St", city: "Kathmandu" }, // Fallback if old clients
                    totalAmount: total,
                    status: 'PENDING',
                    orderItems: {
                        create: items.map((item: any) => ({
                            medicineId: item.id,
                            quantity: item.quantity,
                            unitPrice: item.price
                        }))
                    }
                }
            })

            // Decrement Stock
            for (const item of items) {
                // Simplified: Just find first batch with stock. Real world needs FIFO.
                const stock = await tx.inventory.findFirst({
                    where: { medicineId: item.id, quantity: { gte: item.quantity } }
                })

                if (stock) {
                    await tx.inventory.update({
                        where: { id: stock.id },
                        data: { quantity: stock.quantity - item.quantity }
                    })
                }
            }

            return newOrder
        })

        return NextResponse.json({ success: true, data: order })

    } catch (error: any) {
        console.error('Order creation error:', error)
        return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 })
    }
}

export async function GET(request: Request) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(request.url)
        const viewAll = searchParams.get('all') === 'true'

        if (viewAll && session.role !== 'PHARMACIST') {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
        }

        const where = viewAll ? {} : { customerId: session.userId }

        const orders = await prisma.order.findMany({
            where,
            include: {
                orderItems: {
                    include: { medicine: true }
                },
                customer: true // Include customer details for pharmacist
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json({ success: true, data: orders })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 })
    }
}

