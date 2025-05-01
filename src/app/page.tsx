"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Coins, LineChart, Wallet, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Coins className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">CryptoSave</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-medium hover:underline underline-offset-4">
              Home
            </Link>
            <Link href="#features" className="text-sm font-medium hover:underline underline-offset-4">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:underline underline-offset-4">
              How It Works
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="outline" size="sm">
                Log In
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Save for your future with crypto
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Set savings goals, track your progress, and receive crypto donations to help you reach your
                    financial targets faster.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/auth/register">
                    <Button
                      size="lg"
                      className="relative overflow-hidden group"
                      onMouseEnter={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <span className={`transition-transform duration-300 ${isHovered ? "translate-x-2" : ""}`}>
                        Get Started
                      </span>
                      <ArrowRight
                        className={`ml-2 h-4 w-4 transition-transform duration-300 ${isHovered ? "translate-x-1" : ""}`}
                      />
                    </Button>
                  </Link>
                  <Link href="#how-it-works">
                    <Button size="lg" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-[500px] aspect-square">
                  <Image
                    src="/placeholder.svg?height=500&width=500"
                    alt="Savings dashboard visualization"
                    width={500}
                    height={500}
                    className="rounded-lg object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Everything you need to save for your goals with the power of cryptocurrency
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Secure Authentication</h3>
                <p className="text-center text-muted-foreground">
                  Create an account and securely manage your savings goals with Firebase authentication.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Crypto Wallet Integration</h3>
                <p className="text-center text-muted-foreground">
                  Connect your Aptos and Stellar wallets to deposit and receive crypto for your goals.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm">
                <div className="rounded-full bg-primary/10 p-3">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Progress Tracking</h3>
                <p className="text-center text-muted-foreground">
                  Visualize your savings progress with interactive charts and detailed analytics.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Start saving with cryptocurrency in just a few simple steps
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12 mt-8 items-center">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    1
                  </div>
                  <h3 className="text-xl font-bold">Create an account</h3>
                </div>
                <p className="text-muted-foreground">
                  Sign up using your email and password with secure Firebase authentication.
                </p>

                <div className="flex items-center gap-4 pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    2
                  </div>
                  <h3 className="text-xl font-bold">Set your savings goals</h3>
                </div>
                <p className="text-muted-foreground">
                  Define what you're saving for, set target amounts, and deadlines.
                </p>

                <div className="flex items-center gap-4 pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    3
                  </div>
                  <h3 className="text-xl font-bold">Connect your crypto wallets</h3>
                </div>
                <p className="text-muted-foreground">
                  Link your Aptos wallet for deposits and Stellar wallet for receiving donations.
                </p>

                <div className="flex items-center gap-4 pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                    4
                  </div>
                  <h3 className="text-xl font-bold">Track your progress</h3>
                </div>
                <p className="text-muted-foreground">
                  Monitor your savings with interactive charts and detailed analytics on your dashboard.
                </p>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-[500px] aspect-square">
                  <Image
                    src="/placeholder.svg?height=500&width=500"
                    alt="How it works illustration"
                    width={500}
                    height={500}
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            <span className="text-lg font-semibold">CryptoSave</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © {new Date().getFullYear()} CryptoSave. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:gap-6 md:ml-auto">
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline underline-offset-4">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
