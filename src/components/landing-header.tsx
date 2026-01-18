"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Pill, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LandingHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/50 backdrop-blur-md sticky top-0 z-50 justify-between">
            <Link className="flex items-center justify-center font-bold text-xl text-primary gap-2" href="#">
                <Pill className="h-6 w-6" />
                <span>MediFlow</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden sm:flex ml-auto gap-4 sm:gap-6">
                <Link className="text-sm font-medium hover:text-primary transition-colors hover:underline underline-offset-4" href="/login">
                    Login
                </Link>
                <Link className="text-sm font-medium hover:text-primary transition-colors hover:underline underline-offset-4" href="/register">
                    Register
                </Link>
            </nav>

            {/* Mobile Menu Toggle */}
            <button
                className="sm:hidden p-2 text-gray-600 hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Mobile Nav Overlay */}
            {isMenuOpen && (
                <div className="absolute top-16 left-0 w-full bg-white border-b shadow-lg sm:hidden flex flex-col p-4 space-y-4 animate-in slide-in-from-top-2">
                    <Link
                        className="text-sm font-medium hover:text-primary transition-colors p-2 hover:bg-gray-50 rounded-md"
                        href="/login"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Login
                    </Link>
                    <Link
                        className="text-sm font-medium hover:text-primary transition-colors p-2 hover:bg-gray-50 rounded-md"
                        href="/register"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Register
                    </Link>
                </div>
            )}
        </header>
    )
}
