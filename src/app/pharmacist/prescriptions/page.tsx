'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function PharmacistPrescriptionsPage() {
    const [prescriptions, setPrescriptions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [notes, setNotes] = useState('')
    const [selectedId, setSelectedId] = useState<string | null>(null)

    const fetchPrescriptions = async () => {
        try {
            const res = await fetch('/api/pharmacist/prescriptions')
            const json = await res.json()
            if (json.success) setPrescriptions(json.data)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPrescriptions()
    }, [])

    const handleAction = async (id: string, action: 'VERIFIED' | 'REJECTED') => {
        try {
            const res = await fetch(`/api/pharmacist/prescriptions/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, notes: action === 'REJECTED' ? notes : undefined })
            })
            const json = await res.json()
            if (json.success) {
                toast.success(`Prescription ${action.toLowerCase()}`)
                fetchPrescriptions()
                setNotes('')
                setSelectedId(null)
            } else {
                toast.error('Action failed')
            }
        } catch (e) {
            toast.error('Error')
        }
    }

    if (loading) return <div className="p-8">Loading...</div>

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Pending Prescriptions</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {prescriptions.map(p => (
                    <Card key={p.id}>
                        <CardHeader>
                            <CardTitle>Customer: {p.customer.name}</CardTitle>
                            <CardDescription>{format(new Date(p.createdAt), 'MMM d, h:mm a')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.imageUrl} alt="Prescription" className="w-full h-48 object-cover rounded-md mb-4 bg-gray-100" />
                        </CardContent>
                        <CardFooter className="flex justify-between gap-2">
                            <Button variant="destructive" onClick={() => setSelectedId(p.id)}>Reject</Button>
                            <Button onClick={() => handleAction(p.id, 'VERIFIED')}>Verify</Button>
                        </CardFooter>
                    </Card>
                ))}
                {prescriptions.length === 0 && <p className="text-gray-500">No pending prescriptions.</p>}
            </div>

            <Dialog open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Prescription</DialogTitle>
                        <DialogDescription>Please provide a reason for rejection.</DialogDescription>
                    </DialogHeader>
                    <Textarea
                        placeholder="Reason for rejection..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setSelectedId(null)}>Cancel</Button>
                        <Button variant="destructive" onClick={() => selectedId && handleAction(selectedId, 'REJECTED')}>Confirm Reject</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
