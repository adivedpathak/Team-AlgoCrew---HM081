'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

export default function DeliveryAssignmentsPage() {
    const [assignments, setAssignments] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchAssignments = async () => {
        try {
            const res = await fetch('/api/delivery/assignments')
            const json = await res.json()
            if (json.success) setAssignments(json.data)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAssignments()
    }, [])

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/delivery/assignments/${id}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })
            if (res.ok) {
                toast.success('Status updated')
                fetchAssignments()
            }
        } catch (e) {
            toast.error('Failed')
        }
    }

    const updateLocation = async (id: string) => {
        if (!navigator.geolocation) {
            toast.error('Geolocation is not supported by your browser')
            return
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude: lat, longitude: lng } = position.coords
            try {
                await fetch(`/api/delivery/assignments/${id}/location`, {
                    method: 'PUT',
                    body: JSON.stringify({ lat, lng })
                })
                toast.success('Location updated (Realtime)')
            } catch (e) {
                toast.error('Failed to update location')
            }
        }, (error) => {
            console.error(error)
            toast.error('Unable to retrieve location')
        })
    }

    if (loading) return <div className="p-8">Loading...</div>

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">My Deliveries</h1>
            <div className="space-y-4">
                {assignments.map(a => (
                    <Card key={a.id}>
                        <CardHeader>
                            <div className="flex justify-between">
                                <div>
                                    <CardTitle>{a.order.orderNumber}</CardTitle>
                                    <CardDescription>To: {a.order.customer.name}</CardDescription>
                                    <p className="text-sm text-gray-500">{a.order.deliveryAddress?.street}, {a.order.deliveryAddress?.city}</p>
                                </div>
                                <Badge>{a.status}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {a.status === 'ASSIGNED' && (
                                    <Button onClick={() => updateStatus(a.id, 'PICKED_UP')}>Pick Up Order</Button>
                                )}
                                {a.status === 'PICKED_UP' && (
                                    <Button onClick={() => updateStatus(a.id, 'IN_TRANSIT')}>Start Delivery</Button>
                                )}
                                {a.status === 'IN_TRANSIT' && (
                                    <>
                                        <Button onClick={() => updateLocation(a.id)} variant="outline">Update Location</Button>
                                        <Button onClick={() => updateStatus(a.id, 'DELIVERED')} variant="default">Complete Delivery</Button>
                                    </>
                                )}
                                {a.status === 'DELIVERED' && (
                                    <span className="text-green-600 font-bold">Completed</span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {assignments.length === 0 && <p>No active assignments.</p>}
            </div>
        </div>
    )
}
