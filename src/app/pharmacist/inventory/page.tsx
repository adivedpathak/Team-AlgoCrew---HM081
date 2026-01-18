'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { format } from 'date-fns'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

export default function InventoryPage() {
    const [items, setItems] = useState<any[]>([])
    const [medicines, setMedicines] = useState<any[]>([])

    // Add Stock Form State
    const [selectedMed, setSelectedMed] = useState('')
    const [batch, setBatch] = useState('')
    const [stock, setStock] = useState('')
    const [expiry, setExpiry] = useState('')

    // New Medicine Form State
    const [newMedName, setNewMedName] = useState('')
    const [newMedGeneric, setNewMedGeneric] = useState('')
    const [newMedCategory, setNewMedCategory] = useState('')
    const [newMedPrice, setNewMedPrice] = useState('')
    const [isPrescription, setIsPrescription] = useState('false')

    const fetchInventory = async () => {
        const res = await fetch('/api/inventory')
        const json = await res.json()
        if (json.success) setItems(json.data)
    }

    const fetchMedicines = async () => {
        // Reusing customer medicines API to get the list, or we could create a pharmacist specific one. 
        // Assuming /api/medicines returns all list.
        const res = await fetch('/api/medicines?all=true')
        const json = await res.json()
        if (json.success) setMedicines(json.data)
    }

    useEffect(() => {
        fetchInventory()
        fetchMedicines()
    }, [])

    const handleAddStock = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    medicineId: selectedMed,
                    batchNumber: batch,
                    quantity: parseInt(stock),
                    expiryDate: expiry,
                    reorderLevel: 10 // Default
                })
            })
            if (res.ok) {
                toast.success('Stock added successfully')
                fetchInventory()
                // Reset form
                setBatch('')
                setStock('')
            } else {
                toast.error('Failed to add stock')
            }
        } catch (e) {
            toast.error('Error adding stock')
        }
    }

    const handleCreateMedicine = async (e: React.FormEvent) => {
        e.preventDefault()
        // We typically would need a POST /api/medicines endpoint. I'll need to double check if that exists or create it.
        // Assuming we need to implement it.
        try {
            // For now, let's just pretend we have an endpoint or use a new one.
            // Wait, I haven't implemented POST /api/medicines yet (only GET).
            // I will implement it in the next step.
            const res = await fetch('/api/medicines', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: newMedName,
                    genericName: newMedGeneric,
                    category: newMedCategory,
                    price: parseFloat(newMedPrice),
                    requiresPrescription: isPrescription === 'true',
                    manufacturer: 'Generic', // Placeholder
                    description: 'Added by pharmacist',
                    image: 'https://placehold.co/200'
                })
            })

            if (res.ok) {
                toast.success('Medicine created')
                fetchMedicines()
                setNewMedName('')
                setNewMedGeneric('')
            } else {
                toast.error('Failed to create medicine')
            }
        } catch (e) {
            toast.error('Error creating medicine')
        }
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Inventory Management</h1>
                <div className="flex gap-2">
                    {/* Dialog to Create New Medicine Catalog Item */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="secondary">Create New Medicine</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Add New Medicine to Catalog</DialogTitle></DialogHeader>
                            <form onSubmit={handleCreateMedicine} className="space-y-4">
                                <div><Label>Name</Label><Input value={newMedName} onChange={e => setNewMedName(e.target.value)} required /></div>
                                <div><Label>Generic Name</Label><Input value={newMedGeneric} onChange={e => setNewMedGeneric(e.target.value)} required /></div>
                                <div><Label>Category</Label><Input value={newMedCategory} onChange={e => setNewMedCategory(e.target.value)} required /></div>
                                <div><Label>Price</Label><Input type="number" value={newMedPrice} onChange={e => setNewMedPrice(e.target.value)} required /></div>
                                <div>
                                    <Label>Requires Prescription?</Label>
                                    <Select value={isPrescription} onValueChange={setIsPrescription}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="false">No</SelectItem>
                                            <SelectItem value="true">Yes</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button type="submit" className="w-full">Create Medicine</Button>
                            </form>
                        </DialogContent>
                    </Dialog>

                    {/* Dialog to Add Stock */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button><Plus className="mr-2 h-4 w-4" /> Add Stock</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader><DialogTitle>Add Inventory Stock</DialogTitle></DialogHeader>
                            <form onSubmit={handleAddStock} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Select Medicine</Label>
                                    <Select value={selectedMed} onValueChange={setSelectedMed}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select medicine..." />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[200px]">
                                            {medicines.map(m => (
                                                <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Batch Number</Label>
                                    <Input value={batch} onChange={e => setBatch(e.target.value)} placeholder="BATCH-001" required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Quantity</Label>
                                    <Input type="number" value={stock} onChange={e => setStock(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Expiry Date</Label>
                                    <Input type="date" value={expiry} onChange={e => setExpiry(e.target.value)} required />
                                </div>
                                <Button type="submit" className="w-full">Add Stock</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Current Stock</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Medicine</TableHead>
                                <TableHead>Batch</TableHead>
                                <TableHead>Expiry</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.medicine.name}</TableCell>
                                    <TableCell>{item.batchNumber}</TableCell>
                                    <TableCell>{format(new Date(item.expiryDate), 'MMM d, yyyy')}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>
                                        {item.quantity < item.reorderLevel ? (
                                            <Badge variant="destructive">Low Stock</Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">In Stock</Badge>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
