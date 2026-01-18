'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { format } from 'date-fns'

export default function RefillPage() {
    const [profiles, setProfiles] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    // Form State
    const [name, setName] = useState('')
    const [meds, setMeds] = useState('')
    const [freq, setFreq] = useState('30')
    const [date, setDate] = useState('')

    const fetchProfiles = async () => {
        try {
            const res = await fetch('/api/refill-profiles')
            const json = await res.json()
            if (json.success) setProfiles(json.data)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchProfiles()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/refill-profiles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    medicines: [{ name: meds, quantity: 1 }], // Simplified for demo
                    frequency: freq,
                    nextRefillDate: date
                })
            })
            if (res.ok) {
                toast.success('Profile created')
                fetchProfiles()
                setName('')
                setMeds('')
            }
        } catch (e) {
            toast.error('Failed')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return
        await fetch(`/api/refill-profiles/${id}`, { method: 'DELETE' })
        fetchProfiles()
    }

    const handleReorder = async (id: string) => {
        try {
            const res = await fetch(`/api/refill-profiles/${id}/reorder`, { method: 'POST' })
            const json = await res.json()
            if (json.success) {
                toast.success('Order placed successfully from refill profile!')
            } else {
                toast.error(json.error || 'Failed to place order')
            }
        } catch (e) {
            toast.error('Error')
        }
    }

    if (loading) return <div className="p-8">Loading...</div>

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Refill Profiles</h1>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Create Profile</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>New Refill Profile</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Profile Name</Label>
                                <Input value={name} onChange={e => setName(e.target.value)} placeholder="My Diabetes Meds" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Medicine Name</Label>
                                <Input value={meds} onChange={e => setMeds(e.target.value)} placeholder="Metformin" required />
                            </div>
                            <div className="space-y-2">
                                <Label>Frequency (Days)</Label>
                                <Input type="number" value={freq} onChange={e => setFreq(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Next Refill Date</Label>
                                <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                            </div>
                            <Button type="submit" className="w-full">Save Profile</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map(p => (
                    <Card key={p.id}>
                        <CardHeader>
                            <CardTitle>{p.name}</CardTitle>
                            <CardDescription>Next: {format(new Date(p.nextRefillDate), 'MMM d, yyyy')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="font-semibold">Medicines:</p>
                            <ul className="list-disc list-inside text-sm">
                                {(p.medicines as any[]).map((m, i) => (
                                    <li key={i}>{m.name}</li>
                                ))}
                            </ul>
                            <p className="mt-2 text-sm text-gray-500">Every {p.frequency} days</p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" size="sm" onClick={() => handleReorder(p.id)}>Order Now</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(p.id)}>Delete</Button>
                        </CardFooter>
                    </Card>
                ))}
                {profiles.length === 0 && <p className="text-gray-500">No refill profiles yet.</p>}
            </div>
        </div>
    )
}
