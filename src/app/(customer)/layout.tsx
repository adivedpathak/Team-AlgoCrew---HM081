'use client'

import React from 'react'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { LayoutDashboard, ShoppingBag, Pill, FileText, ShoppingCart, RefreshCw } from 'lucide-react'

const customerItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Medicines', href: '/medicines', icon: Pill },
    { label: 'Prescriptions', href: '/prescriptions', icon: FileText },
    { label: 'My Cart', href: '/cart', icon: ShoppingCart },
    { label: 'My Orders', href: '/orders', icon: ShoppingBag },
    { label: 'Refills', href: '/refill', icon: RefreshCw },
]

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-black">
            <Sidebar items={customerItems} title="Patient" />
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                {children}
            </main>
        </div>
    )
}
