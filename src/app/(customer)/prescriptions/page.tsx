'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

export default function PrescriptionsPage() {
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [prescriptions, setPrescriptions] = useState<any[]>([])

    const fetchPrescriptions = async () => {
        try {
            const res = await fetch('/api/prescriptions')
            const json = await res.json()
            if (json.success) setPrescriptions(json.data)
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        fetchPrescriptions()
    }, [])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/prescriptions', {
                method: 'POST',
                body: formData,
            })
            const json = await res.json()
            if (json.success) {
                toast.success('Prescription uploaded successfully')
                setFile(null)
                // refresh list
            } else {
                toast.error('Upload failed')
            }
        } catch (err) {
            toast.error('Error uploading file')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">My Prescriptions</h1>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Upload New Prescription</CardTitle>
                    <CardDescription>Upload a clear image of your doctor's prescription</CardDescription>
                </CardHeader>
                <form onSubmit={handleUpload}>
                    <CardContent>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="picture">Prescription Image</Label>
                            <Input id="picture" type="file" onChange={handleFileChange} accept="image/*" />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className='mt-3' disabled={!file || uploading}>
                            {uploading ? 'Uploading...' : 'Upload'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">History</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {prescriptions.map(p => (
                        <Card key={p.id}>
                            <CardHeader>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500">{new Date(p.createdAt).toLocaleDateString()}</span>
                                    <Badge variant={p.status === 'VERIFIED' ? 'default' : p.status === 'REJECTED' ? 'destructive' : 'secondary'}>
                                        {p.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={p.imageUrl} alt="Prescription" className="w-full h-32 object-cover rounded bg-gray-100" />
                                {p.notes && <p className="mt-2 text-sm text-red-500">Note: {p.notes}</p>}
                            </CardContent>
                        </Card>
                    ))}
                </div>
                {prescriptions.length === 0 && <p className="text-gray-500">No previous uploads found.</p>}
            </div>
        </div>
    )
}
