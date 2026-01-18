import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

async function uploadToCloudinary(file: Blob) {
    if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name') {
        console.warn("Cloudinary keys missing, using mock")
        return "https://placehold.co/600x400?text=Mock+Prescription"
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'image' },
            (error, result) => {
                if (error) reject(error)
                else resolve(result?.secure_url || '')
            }
        )
        uploadStream.end(buffer)
    })
}

export async function POST(request: Request) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const formData = await request.formData()
        const file = formData.get('file') as Blob

        if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

        const imageUrl = await uploadToCloudinary(file)

        const prescription = await prisma.prescription.create({
            data: {
                customerId: session.userId,
                imageUrl,
                status: 'PENDING'
            }
        })

        return NextResponse.json({ success: true, data: prescription })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 })
    }
}
