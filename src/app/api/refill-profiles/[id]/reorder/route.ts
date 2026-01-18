import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { id: profileId } = await params

        // Fetch profile
        const profile = await prisma.refillProfile.findUnique({
            where: { id: profileId }
        })

        if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

        // Create Order from Profile
        // Note: This logic assumes profile.medicines is basically a cart item structure.
        // In reality, we need to look up prices.
        const rawMedicines = profile.medicines as any[]
        const items: any[] = []
        let total = 0

        for (const m of rawMedicines) {
            // Find medicine by name (since profile stores name/quantity only in our simple demo)
            // Or better, we should have stored IDs.
            // Assuming we stored IDs or look up by name.
            const med = await prisma.medicine.findFirst({ where: { name: { equals: m.name, mode: 'insensitive' } } })
            if (med) {
                items.push({
                    medicineId: med.id,
                    quantity: m.quantity,
                    unitPrice: med.price
                })
                total += Number(med.price) * m.quantity
            }
        }

        if (items.length === 0) return NextResponse.json({ error: 'No valid medicines found' }, { status: 400 })

        const orderNumber = `ORD-REFILL-${Date.now()}`

        // Check stock and create order (reusing logic would be best, but for now copying simplicity)
        const order = await prisma.$transaction(async (tx) => {
            // Create Order
            const newOrder = await tx.order.create({
                data: {
                    orderNumber,
                    customerId: session.userId,
                    deliveryAddress: { street: "Refill Address", city: "Kathmandu" }, // Should come from profile or user
                    totalAmount: total,
                    status: 'PENDING',
                    orderItems: {
                        create: items
                    }
                }
            })

            // Update next refill date
            const nextDate = new Date()
            nextDate.setDate(nextDate.getDate() + profile.frequency)

            await tx.refillProfile.update({
                where: { id: profileId },
                data: { nextRefillDate: nextDate }
            })

            return newOrder
        })

        return NextResponse.json({ success: true, data: order })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 })
    }
}
