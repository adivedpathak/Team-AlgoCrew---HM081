import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')

    const where: any = {}
    if (search) {
        where.OR = [
            { name: { contains: search, mode: 'insensitive' } },
            { genericName: { contains: search, mode: 'insensitive' } }
        ]
    }
    if (category) {
        where.category = category
    }

    try {
        const medicines = await prisma.medicine.findMany({
            where,
            orderBy: { name: 'asc' }
        })
        return NextResponse.json({ success: true, data: medicines })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch medicines' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    // Optional: Add auth check for Admin/Pharmacist if needed
    const session = await getSession()
    if (!session || session.role !== 'PHARMACIST') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const medicine = await prisma.medicine.create({
            data: {
                name: body.name,
                genericName: body.genericName,
                manufacturer: body.manufacturer,
                category: body.category,
                description: body.description,
                price: body.price,
                requiresPrescription: body.requiresPrescription,
                image: body.image
            }
        })
        return NextResponse.json({ success: true, data: medicine })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create medicine' }, { status: 500 })
    }
}
