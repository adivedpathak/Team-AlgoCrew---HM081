import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { startOfMonth, subMonths, format } from 'date-fns'

export async function GET(request: Request) {
    const session = await getSession()
    if (!session || session.role !== 'PHARMACIST') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // 1. Counts
        const pendingOrdersCount = await prisma.order.count({ where: { status: 'PENDING' } })
        const pendingRxCount = await prisma.prescription.count({ where: { status: 'PENDING' } })

        // Low stock: items where quantity < reorderLevel
        // Prisma doesn't support comparing two columns directly in `where` easily in simple query, 
        // but we can filter in memory or use raw query. For speed/simplicity with small data, let's filter in memory or filtered list
        // Actually, let's just count all items for now, or find raw. 
        // Let's iterate.
        const allInventory = await prisma.inventory.findMany()
        const lowStockCount = allInventory.filter(i => i.quantity < i.reorderLevel).length

        // 2. Revenue (Total paid or confirmed orders)
        // Assuming status DELIVERED or PAID means revenue. Let's use total of all non-cancelled/pending
        const completedOrders = await prisma.order.findMany({
            where: { status: { in: ['DELIVERED', 'OUT_FOR_DELIVERY', 'READY', 'PROCESSING', 'CONFIRMED'] } },
            select: { totalAmount: true }
        })
        const totalRevenue = completedOrders.reduce((acc, curr) => acc + Number(curr.totalAmount), 0)

        // 3. Monthly Sales Chart Data (Last 6 months)
        const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5))
        const monthlyOrders = await prisma.order.findMany({
            where: { createdAt: { gte: sixMonthsAgo } },
            select: { createdAt: true, totalAmount: true }
        })

        const chartDataMap = new Map<string, number>()
        // Initialize last 6 months
        for (let i = 0; i < 6; i++) {
            const d = subMonths(new Date(), i)
            chartDataMap.set(format(d, 'MMM'), 0)
        }

        monthlyOrders.forEach(o => {
            const month = format(o.createdAt, 'MMM')
            if (chartDataMap.has(month)) {
                chartDataMap.set(month, chartDataMap.get(month)! + Number(o.totalAmount))
            }
        })

        // Convert map to array and reverse to show oldest first logic if needed, but Map iteration order is insertion if not re-set? 
        // Actually just build array from scratch
        const chartData = []
        for (let i = 5; i >= 0; i--) {
            const d = subMonths(new Date(), i)
            const name = format(d, 'MMM')
            chartData.push({ name, total: chartDataMap.get(name) || 0 })
        }

        // 4. Recent Activity (Latest 5 orders)
        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { customer: { select: { name: true } } }
        })

        return NextResponse.json({
            success: true,
            data: {
                counts: {
                    revenue: totalRevenue,
                    pendingOrders: pendingOrdersCount,
                    pendingRx: pendingRxCount,
                    lowStock: lowStockCount
                },
                chartData,
                recentActivity: recentOrders
            }
        })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 })
    }
}
