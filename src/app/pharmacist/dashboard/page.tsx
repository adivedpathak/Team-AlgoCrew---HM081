'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, BarChart4, DollarSign, Package } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import Link from 'next/link'

export default function PharmacistDashboard() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/pharmacist/stats')
            .then(r => r.json())
            .then(d => {
                if (d.success) setData(d.data)
                setLoading(false)
            })
    }, [])

    if (loading || !data) return <div className="p-8">Loading dashboard metrics...</div>

    const { counts, chartData, recentActivity } = data

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                <Link href="/pharmacist/inventory">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Add Inventory
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue (Est.)</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${counts.revenue.toFixed(2)}</div>
                        <p className="text-xs text-muted-foreground">Lifetime sales</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{counts.pendingOrders}</div>
                        <p className="text-xs text-muted-foreground">Needs processing</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                        <BarChart4 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${counts.lowStock > 0 ? 'text-red-500' : ''}`}>{counts.lowStock}</div>
                        <p className="text-xs text-muted-foreground">Restock immediately</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Prescriptions</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{counts.pendingRx}</div>
                        <p className="text-xs text-muted-foreground">Needs verification</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Sales Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={chartData}>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip />
                                <Bar dataKey="total" fill="#0d9488" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest orders received.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity.map((order: any, i: number) => (
                                <div key={order.id} className="flex items-center">
                                    <span className="relative flex h-2 w-2 mr-4">
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{order.orderNumber}</p>
                                        <p className="text-xs text-muted-foreground">by {order.customer.name}</p>
                                    </div>
                                    <div className="ml-auto font-medium">+${Number(order.totalAmount).toFixed(0)}</div>
                                </div>
                            ))}
                            {recentActivity.length === 0 && <p className="text-sm text-gray-500">No recent activity.</p>}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
