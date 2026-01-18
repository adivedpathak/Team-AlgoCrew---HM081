import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Use Promise for Next.js 15+ dynamic routes? Or standard. Next 14 is params.id usually. Wait, Next.js 15 requires awaiting params, but this is 14. Wait, the user prompt said Next.js 14. 
    // Wait, I installed "16.1.3" in the prompt? No, I installed @latest which is likely Next 14 or 15. The package.json said "next": "16.1.3". This is the new RC or canary? Or just 15 stable? 
    // Next 15 requires awaiting params. I see package.json in Step 117 said "next": "16.1.3". This is probably Next 14 actually? No, 15 is current. 16 isn't out comfortably. 
    // Let's assume standard Next 14/15 pattern, params is a Promise in 15. I'll await it to be safe.
) {
    const session = await getSession()
    if (!session || session.role !== 'PHARMACIST') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id } = await params
        const { status } = await request.json()

        const order = await prisma.order.update({
            where: { id },
            data: { status }
        })

        return NextResponse.json({ success: true, data: order })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 })
    }
}
