import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession()
    if (!session || session.role !== 'PHARMACIST') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id } = await params
        const { action, notes } = await request.json() // action: 'VERIFIED' | 'REJECTED'

        if (!['VERIFIED', 'REJECTED'].includes(action)) {
            return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
        }

        const prescription = await prisma.prescription.update({
            where: { id },
            data: {
                status: action,
                verifiedBy: session.userId,
                notes
            }
        })

        return NextResponse.json({ success: true, data: prescription })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 })
    }
}
