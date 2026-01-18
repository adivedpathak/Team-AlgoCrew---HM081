import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster as Sonner } from 'sonner'
import '@/app/globals.css'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'MediFlow - Digital Pharmacy',
  description: 'Your health, delivered.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.variable
      )}>
        {children}
        <Sonner />
      </body>
    </html>
  )
}
