import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Truck, Activity, ShieldCheck } from 'lucide-react'
import { LandingHeader } from '@/components/landing-header'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-secondary/50 to-background">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-4">
                <span className="px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full">
                  New: Real-time Delivery Tracking
                </span>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-foreground">
                  Your Health, <span className="text-primary">Delivered.</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Connect with certified pharmacists, manage prescriptions, and track your medicine delivery in real-time. Professional healthcare at your fingertips.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto justify-center">
                <Link href="/register" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto h-12 px-8 text-lg rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                    Get Started
                  </Button>
                </Link>
                <Link href="/medicines" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto h-12 px-8 text-lg rounded-full border-2">
                    Browse Medicines
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center p-4 border rounded-2xl hover:border-primary/50 transition-colors bg-card">
                <div className="p-3 bg-secondary rounded-full mb-4">
                  <ShieldCheck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Verified Pharmacists</h3>
                <p className="text-muted-foreground">
                  All prescriptions are verified by licensed professionals before processing.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 border rounded-2xl hover:border-primary/50 transition-colors bg-card">
                <div className="p-3 bg-secondary rounded-full mb-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Fast Delivery</h3>
                <p className="text-muted-foreground">
                  Real-time tracking from the pharmacy to your doorstep.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4 border rounded-2xl hover:border-primary/50 transition-colors bg-card">
                <div className="p-3 bg-secondary rounded-full mb-4">
                  <Activity className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Refills</h3>
                <p className="text-muted-foreground">
                  Set up recurring profiles and never run out of essential medicines.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t mt-auto bg-muted/50">
        <p className="text-xs text-muted-foreground">Team AlgoCrew</p>
      </footer>
    </div>
  )
}
