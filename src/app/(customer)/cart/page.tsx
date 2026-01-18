'use client'

import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useRouter } from 'next/navigation'
import { Trash2, MapPin } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'

export default function CartPage() {
    const { items, removeItem, updateQuantity, total, clearCart } = useCartStore()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [address, setAddress] = useState({ city: '', street: '' })

    const handleCheckout = async () => {
        // Check if any item needs prescription
        const needsRx = items.some(i => i.requiresPrescription)
        if (needsRx) {
            toast.info('Some items require a prescription. Please upload one in the next step.')
            // In a real flow, redirect to prescription upload or attach it here
            // For now, let's just create order pending prescription
        }

        setLoading(true)
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items, total: total(), address }),
            })

            const json = await res.json()
            if (json.success) {
                toast.success('Order placed successfully!')
                clearCart()
                router.push(`/orders`)
            } else {
                toast.error(json.error || 'Failed to place order')
            }
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (items.length === 0) {
        return (
            <div className="container mx-auto p-12 text-center">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <Button onClick={() => router.push('/medicines')}>Browse Medicines</Button>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

            <div className="grid gap-6">
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead className="text-right">Total</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            {item.name}
                                            {item.requiresPrescription && (
                                                <span className="ml-2 text-xs text-red-500 font-semibold">(Rx)</span>
                                            )}
                                        </TableCell>
                                        <TableCell>${item.price.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                                className="w-20"
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center p-6 border-t bg-gray-50">
                        <div className="text-2xl font-bold">Total: ${total().toFixed(2)}</div>
                        <div className="space-x-4">
                            <Button variant="outline" onClick={() => router.push('/medicines')}>Continue Shopping</Button>
                            <Button onClick={handleCheckout} disabled={loading}>
                                {loading ? 'Processing...' : 'Place Order'}
                            </Button>
                        </div>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Delivery Address</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-end">
                            <Button variant="outline" size="sm" onClick={() => {
                                if (!navigator.geolocation) return toast.error('Geolocation not supported')
                                navigator.geolocation.getCurrentPosition(
                                    () => {
                                        // For now, we mock reverse geocoding as we don't have a Google Maps API key
                                        setAddress({ city: 'Kathmandu (Detected)', street: 'Current Location' })
                                        toast.success('Location detected')
                                    },
                                    () => toast.error('Location access denied')
                                )
                            }}>
                                <MapPin className="mr-2 h-4 w-4" /> Use Current Location
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">City</label>
                                <Input
                                    value={address.city}
                                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                                    placeholder="Kathmandu"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Street Address</label>
                                <Input
                                    value={address.street}
                                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                                    placeholder="123 Main St"
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center p-6 border-t bg-gray-50 dark:bg-slate-900/50">
                        <div className="text-2xl font-bold">Total: ${total().toFixed(2)}</div>
                        <div className="space-x-4">
                            <Button variant="outline" onClick={() => router.push('/medicines')}>Continue Shopping</Button>
                            <Button onClick={handleCheckout} disabled={loading || !address.city || !address.street}>
                                {loading ? 'Processing...' : 'Place Order'}
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
