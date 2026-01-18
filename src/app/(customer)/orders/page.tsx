'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await fetch('/api/orders')
                const json = await res.json()
                if (json.success) {
                    setOrders(json.data)
                } else {
                    console.error(json.error)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    if (loading) return <div className="p-8">Loading orders...</div>

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">My Orders</h1>
            <div className="space-y-4">
                {orders.map((order) => (
                    <Card key={order.id}>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>{order.orderNumber}</CardTitle>
                                    <CardDescription>Placed on {format(new Date(order.createdAt), 'MMM d, yyyy')}</CardDescription>
                                </div>
                                <Badge variant={order.status === 'DELIVERED' ? 'default' : 'secondary'}>
                                    {order.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {order.orderItems.map((item: any) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span>{item.quantity}x {item.medicine.name}</span>
                                        <span>${Number(item.unitPrice).toFixed(2)}</span>
                                    </div>
                                ))}
                                <div className="pt-4 border-t flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>${Number(order.totalAmount).toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {orders.length === 0 && <p className="text-gray-500">No orders found.</p>}
            </div>
        </div>
    )
}
