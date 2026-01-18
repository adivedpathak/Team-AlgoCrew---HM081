'use client'

import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet' // Requires installing these
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix generic Leaflet marker icon issue in Next.js
const icon = L.icon({
    iconUrl: '/marker-icon.png',
    shadowUrl: '/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Component to recenter map
function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap()
    useEffect(() => {
        map.setView(center)
    }, [center, map])
    return null
}

export default function TrackOrderPage({ params }: { params: Promise<{ id: string }> }) {
    const [orderId, setOrderId] = useState<string>('')

    // Unwrap params
    useEffect(() => {
        params.then(p => setOrderId(p.id))
    }, [params])

    const [tracking, setTracking] = useState<any>(null)

    useEffect(() => {
        if (!orderId) return

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/orders/${orderId}/track`)
                const json = await res.json()
                if (json.success) setTracking(json.data)
            } catch (e) {
                console.error(e)
            }
        }, 5000)

        return () => clearInterval(interval)
    }, [orderId])

    if (!tracking) return <div className="p-8">Loading tracking info... (Or delivery not started)</div>

    const position: [number, number] = tracking.currentLocation
        ? [tracking.currentLocation.lat, tracking.currentLocation.lng]
        : [27.7172, 85.3240] // Default Kathmandu

    return (
        <div className="container mx-auto p-4 h-screen flex flex-col">
            <Card className="mb-4">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Delivery Tracking</CardTitle>
                            <CardDescription>Driver: {tracking.deliveryPerson.name} ({tracking.deliveryPerson.phone})</CardDescription>
                        </div>
                        <Badge className="text-lg animate-pulse">{tracking.status}</Badge>
                    </div>
                </CardHeader>
            </Card>

            <div className="flex-1 rounded-lg overflow-hidden border">
                <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {tracking.currentLocation && (
                        <Marker position={position}>
                            <Popup>
                                Delivery Person is here.
                            </Popup>
                        </Marker>
                    )}
                    <MapUpdater center={position} />
                </MapContainer>
            </div>
        </div>
    )
}
