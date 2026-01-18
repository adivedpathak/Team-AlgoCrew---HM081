'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LogOut, Pill } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface SidebarProps {
    items: {
        label: string
        href: string
        icon: React.ElementType
    }[]
    title: string
}

export function Sidebar({ items, title }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        toast.success('Logged out')
        router.push('/login')
    }

    return (
        <div className="flex h-screen w-64 flex-col bg-white dark:bg-slate-900 border-r dark:border-slate-800">
            <div className="p-6 border-b dark:border-slate-800 flex items-center gap-3">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white">
                    <Pill className="h-5 w-5" />
                </div>
                <span className="font-bold text-xl text-slate-800 dark:text-slate-100">MediFlow</span>
            </div>

            <div className="px-4 py-2">
                <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {title} Potal
                </h2>
            </div>

            <nav className="flex-1 space-y-1 px-4">
                {items.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    return (
                        <Link key={item.href} href={item.href}>
                            <span className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                            )}>
                                <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-slate-400")} />
                                {item.label}
                            </span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t dark:border-slate-800">
                <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20" onClick={handleLogout}>
                    <LogOut className="mr-2 h-5 w-5" />
                    Logout
                </Button>
            </div>
        </div>
    )
}
