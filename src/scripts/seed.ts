import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    // Clear existing data
    await prisma.delivery.deleteMany()
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.prescription.deleteMany()
    await prisma.inventory.deleteMany()
    await prisma.medicine.deleteMany()
    await prisma.refillProfile.deleteMany()
    await prisma.user.deleteMany()

    // 1. Create Users
    const password = await bcrypt.hash('password123', 10)

    const pharmacist = await prisma.user.create({
        data: {
            email: 'pharmacist@mediflow.com',
            password,
            name: 'Pharma Pro',
            phone: '9800000001',
            role: 'PHARMACIST',
            address: { city: 'Kathmandu' }
        }
    })

    const delivery = await prisma.user.create({
        data: {
            email: 'driver@mediflow.com',
            password,
            name: 'Fast Rider',
            phone: '9800000002',
            role: 'DELIVERY',
            address: { city: 'Kathmandu' }
        }
    })

    const customer = await prisma.user.create({
        data: {
            email: 'john@example.com',
            password,
            name: 'John Doe',
            phone: '9800000003',
            role: 'CUSTOMER',
            address: { city: 'Lalitpur', street: 'Pulchowk' }
        }
    })

    console.log('Users created.')

    // 2. Create Medicines
    const medicines = [
        {
            name: 'Napa',
            genericName: 'Paracetamol',
            manufacturer: 'Beximco',
            category: 'Pain Relief',
            description: 'Effective for fever and mild pain.',
            price: 2.5,
            requiresPrescription: false, // Updated to boolean
            image: 'https://placehold.co/200x200?text=Napa'
        },
        {
            name: 'Amoxicillin 500mg',
            genericName: 'Amoxicillin',
            manufacturer: 'Square',
            category: 'Antibiotics',
            description: 'Broad spectrum antibiotic.',
            price: 15.0,
            requiresPrescription: true, // Updated to boolean
            image: 'https://placehold.co/200x200?text=Amox'
        },
        {
            name: 'Pantop 40',
            genericName: 'Pantoprazole',
            manufacturer: 'Aristo',
            category: 'Gastric',
            description: 'For acidity and heartburn.',
            price: 8.0,
            requiresPrescription: false, // Updated to boolean
            image: 'https://placehold.co/200x200?text=Pantop'
        },
        {
            name: 'Montair LC',
            genericName: 'Montalukast + Levocetirizine',
            manufacturer: 'Cipla',
            category: 'Allergy',
            description: 'Relief from allergic rhinitis.',
            price: 12.0,
            requiresPrescription: false, // Updated to boolean
            image: 'https://placehold.co/200x200?text=Montair'
        }
    ]

    for (const med of medicines) {
        const createdMed = await prisma.medicine.create({ data: med })

        // 3. Create Inventory
        await prisma.inventory.create({
            data: {
                medicineId: createdMed.id,
                batchNumber: `BATCH-${Math.floor(Math.random() * 1000)}`,
                quantity: 100,
                expiryDate: new Date('2026-12-31'),
                reorderLevel: 20
            }
        })
    }

    console.log('Medicines and Inventory seeded.')
    console.log('Database seeded successfully.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
