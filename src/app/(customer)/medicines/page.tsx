'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useCartStore, CartItem } from '@/store/cart'
import { toast } from 'sonner'

export default function MedicinesPage() {
    const [medicines, setMedicines] = useState<any[]>([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const addItem = useCartStore((state) => state.addItem)

    const fetchMedicines = async (term: string) => {
        setLoading(true)
        try {
            const res = await fetch(`/api/medicines?search=${term}`)
            const json = await res.json()
            if (json.success) {
                setMedicines(json.data)
            }
        } catch (err) {
            toast.error('Failed to load medicines')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMedicines('')
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        fetchMedicines(search)
    }

    const handleAddToCart = (medicine: any) => {
        const item: CartItem = {
            id: medicine.id,
            name: medicine.name,
            price: Number(medicine.price),
            quantity: 1,
            image: medicine.image,
            requiresPrescription: medicine.requiresPrescription
        }
        addItem(item)
        toast.success('Added to cart')
    }

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Medicines</h1>
                <Button variant="outline" asChild><a href="/cart">View Cart</a></Button>
            </div>

            <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                    placeholder="Search medicines..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-md"
                />
                <Button type="submit">Search</Button>
            </form>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {medicines.map((med) => (
                        <Card key={med.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{med.name}</CardTitle>
                                    {med.requiresPrescription && (
                                        <Badge variant="destructive">Rx</Badge>
                                    )}
                                </div>
                                <CardDescription>{med.genericName}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500 mb-2">{med.category}</p>
                                <p className="font-bold text-xl">${Number(med.price).toFixed(2)}</p>
                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{med.description}</p>
                            </CardContent>
                            <CardFooter>
                                <Button className="w-full" onClick={() => handleAddToCart(med)}>
                                    Add to Cart
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
