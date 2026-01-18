'use client'

import React from 'react'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { LayoutDashboard, Package, ClipboardCheck, ShoppingBag } from 'lucide-react'

const pharmacistItems = [
    { label: 'Dashboard', href: '/pharmacist/dashboard', icon: LayoutDashboard },
    { label: 'Inventory', href: '/pharmacist/inventory', icon: Package },
    { label: 'Orders Queue', href: '/pharmacist/orders', icon: ShoppingBag },
    { label: 'Prescriptions', href: '/pharmacist/prescriptions', icon: ClipboardCheck },
]

export default function PharmacistLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-black">
            <Sidebar items={pharmacistItems} title="Pharmacist" />
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                {children}
            </main>
        </div>
    )
}
