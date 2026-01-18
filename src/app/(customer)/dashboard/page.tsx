'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ShoppingBag, RefreshCw, FileText, TrendingUp, AlertCircle } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const spendingData = [
    { name: 'Jan', amount: 45 },
    { name: 'Feb', amount: 52 },
    { name: 'Mar', amount: 38 },
    { name: 'Apr', amount: 65 },
    { name: 'May', amount: 48 },
    { name: 'Jun', amount: 60 },
]

export default function CustomerDashboard() {
    const [user, setUser] = useState<any>(null)
    const [orders, setOrders] = useState<any[]>([])

    const [refillCount, setRefillCount] = useState(0)
    const [prescriptionCount, setPrescriptionCount] = useState(0)

    useEffect(() => {
        fetch('/api/auth/me').then(r => r.json()).then(d => d.success && setUser(d.data))
        fetch('/api/orders').then(r => r.json()).then(d => d.success && setOrders(d.data.slice(0, 3)))
        fetch('/api/refill-profiles').then(r => r.json()).then(d => d.success && setRefillCount(d.data.length))
        fetch('/api/prescriptions').then(r => r.json()).then(d => d.success && setPrescriptionCount(d.data.filter((p: any) => p.status === 'VERIFIED').length))
    }, [])

    if (!user) return <div className="p-8">Loading...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome, {user.name}</h1>
                    <p className="text-muted-foreground">Manage your health and orders.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{orders.filter(o => o.status !== 'DELIVERED').length}</div>
                        <p className="text-xs text-muted-foreground">In progress</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Refill Profiles</CardTitle>
                        <RefreshCw className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{refillCount}</div>
                        <p className="text-xs text-muted-foreground">Active recurring</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{prescriptionCount}</div>
                        <p className="text-xs text-muted-foreground">Verified total</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Health Score</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">92%</div>
                        <p className="text-xs text-muted-foreground">Based on adherence</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Spending Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={spendingData}>
                                <defs>
                                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                <Tooltip />
                                <Area type="monotone" dataKey="amount" stroke="#0d9488" fillOpacity={1} fill="url(#colorAmount)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                        <CardDescription>Track your latest medical supplies.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {orders.map(o => (
                                <div key={o.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-slate-900/50">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700">
                                            <ShoppingBag className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{o.orderNumber}</p>
                                            <p className="text-xs text-gray-500">{format(new Date(o.createdAt), 'MMM d, yyyy')}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm">${Number(o.totalAmount).toFixed(0)}</p>
                                        <p className="text-xs text-teal-600">{o.status}</p>
                                    </div>
                                </div>
                            ))}
                            {orders.length === 0 && <div className="text-center py-8 text-gray-500">No recent orders found</div>}

                            <Link href="/medicines" className="block mt-4">
                                <Button className="w-full" variant="outline">Place New Order</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
