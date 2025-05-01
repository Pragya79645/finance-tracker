"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Coins, Heart, LogOut, Search, Settings, User, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Mock data for savings goals
const mockGoals = [
  {
    id: "1",
    title: "New Laptop",
    description: "Save for a MacBook Pro",
    target: 2000,
    current: 1200,
    currency: "USD",
    deadline: "2023-12-31",
    createdAt: "2023-06-15",
    donations: [{ id: "1", date: "2023-08-01", amount: 100, donor: "Anonymous" }],
  },
  {
    id: "2",
    title: "Vacation",
    description: "Trip to Bali",
    target: 3500,
    current: 1750,
    currency: "USD",
    deadline: "2024-03-15",
    createdAt: "2023-07-01",
    donations: [{ id: "1", date: "2023-08-15", amount: 250, donor: "Anonymous" }],
  },
  {
    id: "3",
    title: "Emergency Fund",
    description: "6 months of expenses",
    target: 10000,
    current: 4000,
    currency: "USD",
    deadline: "2024-06-30",
    createdAt: "2023-05-10",
    donations: [],
  },
]

export default function Donate() {
  const [goals, setGoals] = useState(mockGoals)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGoal, setSelectedGoal] = useState<any>(null)
  const [donationAmount, setDonationAmount] = useState("")
  const [donationOpen, setDonationOpen] = useState(false)
  const [donationSuccess, setDonationSuccess] = useState(false)

  const filteredGoals = goals.filter(
    (goal) =>
      goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDonate = () => {
    const amount = Number.parseFloat(donationAmount)
    if (isNaN(amount) || amount <= 0 || !selectedGoal) return

    const updatedGoals = goals.map((goal) => {
      if (goal.id === selectedGoal.id) {
        const newDonation = {
          id: (goal.donations.length + 1).toString(),
          date: new Date().toISOString().split("T")[0],
          amount,
          donor: "Anonymous",
        }

        return {
          ...goal,
          current: goal.current + amount,
          donations: [...goal.donations, newDonation],
        }
      }
      return goal
    })

    setGoals(updatedGoals)
    setDonationOpen(false)
    setDonationAmount("")
    setDonationSuccess(true)

    // Reset success message after 3 seconds
    setTimeout(() => {
      setDonationSuccess(false)
    }, 3000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Coins className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">CryptoSave</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
              Dashboard
            </Link>
            <Link href="/wallets" className="text-sm font-medium hover:text-primary">
              Wallets
            </Link>
            <Link href="/donate" className="text-sm font-medium text-primary">
              Donations
            </Link>
            <Link href="/settings" className="text-sm font-medium hover:text-primary">
              Settings
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wallets" className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    <span>Wallets</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <Separator className="my-1" />
                <DropdownMenuItem asChild>
                  <Link href="/" className="flex items-center gap-2 text-destructive">
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="flex-1 container px-4 py-6">
        <div className="grid gap-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Dashboard</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">Donations</h1>
            <p className="text-muted-foreground ml-2">Receive and manage donations for your goals</p>
          </div>

          {donationSuccess && (
            <Alert className="bg-green-50 border-green-200">
              <Heart className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                Donation successful! Thank you for your contribution.
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search goals..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGoals.map((goal) => (
              <Card key={goal.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{goal.title}</CardTitle>
                  <CardDescription>{goal.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm font-medium">{((goal.current / goal.target) * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${goal.current.toFixed(2)} raised</span>
                      <span>${goal.target.toFixed(2)} goal</span>
                    </div>
                  </div>

                  <div className="text-sm">
                    <div className="font-medium">Target Date</div>
                    <div className="text-muted-foreground">{new Date(goal.deadline).toLocaleDateString()}</div>
                  </div>

                  <div className="text-sm">
                    <div className="font-medium">Recent Donations</div>
                    {goal.donations.length > 0 ? (
                      <div className="mt-2 space-y-2">
                        {goal.donations.slice(0, 2).map((donation) => (
                          <div key={donation.id} className="flex justify-between text-muted-foreground">
                            <span>{donation.donor}</span>
                            <span>${donation.amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted-foreground">No donations yet</div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full"
                        onClick={() => {
                          setSelectedGoal(goal)
                          setDonationOpen(true)
                        }}
                      >
                        <Heart className="mr-2 h-4 w-4" />
                        Donate
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Donate to {selectedGoal?.title}</DialogTitle>
                        <DialogDescription>
                          Support this savings goal with a donation from your Stellar wallet.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <div className="font-medium">Goal Progress</div>
                          <Progress
                            value={selectedGoal ? (selectedGoal.current / selectedGoal.target) * 100 : 0}
                            className="h-2"
                          />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>${selectedGoal?.current.toFixed(2)} raised</span>
                            <span>${selectedGoal?.target.toFixed(2)} goal</span>
                          </div>
                        </div>

                        <div className="grid gap-2">
                          <Label htmlFor="amount">Donation Amount (USD)</Label>
                          <Input
                            id="amount"
                            type="number"
                            placeholder="10"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(e.target.value)}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDonationOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleDonate}>Donate</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
