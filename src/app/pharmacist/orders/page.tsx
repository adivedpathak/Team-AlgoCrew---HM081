'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function PharmacistOrdersPage() {
    const [orders, setOrders] = useState<any[]>([])
    const [deliveryPeople, setDeliveryPeople] = useState<any[]>([]) // Mock initialized empty, fetch later
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchOrders()
    }, [])

    const fetchOrders = async () => {
        try {
            const [ordersRes, driversRes] = await Promise.all([
                fetch('/api/orders?all=true'),
                fetch('/api/users?role=DELIVERY')
            ])

            const ordersJson = await ordersRes.json()
            const driversJson = await driversRes.json()

            if (ordersJson.success) setOrders(ordersJson.data)
            if (driversJson.success) setDeliveryPeople(driversJson.data)
        } finally {
            setLoading(false)
        }
    }

    const updateStatus = async (orderId: string, status: string) => {
        try {
            const res = await fetch(`/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })
            if (res.ok) {
                toast.success(`Order updated to ${status}`)
                fetchOrders()
            }
        } catch (e) {
            toast.error('Failed to update')
        }
    }

    const assignDriver = async (orderId: string, deliveryPersonId: string) => {
        try {
            const res = await fetch(`/api/orders/${orderId}/assign`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deliveryPersonId })
            })
            if (res.ok) {
                toast.success('Driver assigned')
                fetchOrders()
            } else {
                toast.error('Failed to assign')
            }
        } catch (e) {
            toast.error('Error')
        }
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Order Processing Queue</h1>
            <div className="space-y-4">
                {orders.map(order => (
                    <Card key={order.id}>
                        <CardHeader>
                            <div className="flex justify-between">
                                <div>
                                    <CardTitle>{order.orderNumber}</CardTitle>
                                    <CardDescription>Customer: {order.customer?.name || 'Unknown'}</CardDescription>
                                </div>
                                <Badge>{order.status}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm space-y-1">
                                {order.orderItems?.map((item: any) => (
                                    <div key={item.id}>{item.quantity}x {item.medicine?.name}</div>
                                ))}
                            </div>
                            <div className="mt-4 flex gap-2">
                                {order.status === 'PENDING' && (
                                    <Button onClick={() => updateStatus(order.id, 'CONFIRMED')}>Confirm Order</Button>
                                )}
                                {order.status === 'CONFIRMED' && (
                                    <Button onClick={() => updateStatus(order.id, 'PROCESSING')}>Start Processing</Button>
                                )}
                                {order.status === 'PROCESSING' && (
                                    <Button onClick={() => updateStatus(order.id, 'READY')}>Mark Ready</Button>
                                )}
                                {order.status === 'READY' && (
                                    <div className="flex gap-2 items-center">
                                        <Select onValueChange={(val) => {
                                            // Assign delivery API call here
                                            assignDriver(order.id, val)
                                        }}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Assign Delivery" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {deliveryPeople.map(d => (
                                                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
