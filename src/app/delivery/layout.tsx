'use client'

import React from 'react'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { LayoutDashboard, Truck } from 'lucide-react'

const deliveryItems = [
    { label: 'Dashboard', href: '/delivery/dashboard', icon: LayoutDashboard },
    { label: 'My Assignments', href: '/delivery/assignments', icon: Truck },
]

export default function DeliveryLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-black">
            <Sidebar items={deliveryItems} title="Delivery" />
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                {children}
            </main>
        </div>
    )
}
