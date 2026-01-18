import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
    const session = await getSession()
    if (!session || session.role !== 'PHARMACIST') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const inventory = await prisma.inventory.findMany({
            include: { medicine: true },
            orderBy: { expiryDate: 'asc' }
        })
        return NextResponse.json({ success: true, data: inventory })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await getSession()
    if (!session || session.role !== 'PHARMACIST') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { medicineId, batchNumber, quantity, expiryDate, reorderLevel } = body

        const stock = await prisma.inventory.create({
            data: {
                medicineId,
                batchNumber,
                quantity: parseInt(quantity),
                expiryDate: new Date(expiryDate),
                reorderLevel: parseInt(reorderLevel)
            }
        })

        return NextResponse.json({ success: true, data: stock })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 })
    }
}
