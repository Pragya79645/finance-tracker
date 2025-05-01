"use client"

import { useState } from "react"
import Link from "next/link"
import { Coins, DollarSign, LogOut, Plus, Settings, Target, User, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DashboardChart } from "@/components/dashboard-chart"

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
  },
]

// Mock wallet data
const walletData = {
  aptos: {
    connected: true,
    address: "0x1a2b3c4d5e6f...",
    balance: 250,
  },
  stellar: {
    connected: true,
    address: "GABCD...",
    balance: 500,
  },
}

export default function Dashboard() {
  const [goals, setGoals] = useState(mockGoals)
  const [newGoalOpen, setNewGoalOpen] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    target: "",
    deadline: "",
  })

  const handleCreateGoal = () => {
    const goal = {
      id: (goals.length + 1).toString(),
      title: newGoal.title,
      description: newGoal.description,
      target: Number.parseFloat(newGoal.target),
      current: 0,
      currency: "USD",
      deadline: newGoal.deadline,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setGoals([...goals, goal])
    setNewGoalOpen(false)
    setNewGoal({
      title: "",
      description: "",
      target: "",
      deadline: "",
    })
  }

  // Calculate total savings across all goals
  const totalSaved = goals.reduce((sum, goal) => sum + goal.current, 0)
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0)
  const overallProgress = (totalSaved / totalTarget) * 100

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Coins className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">CryptoSave</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-primary">
              Dashboard
            </Link>
            <Link href="/wallets" className="text-sm font-medium hover:text-primary">
              Wallets
            </Link>
            <Link href="/donate" className="text-sm font-medium hover:text-primary">
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Track your savings goals and progress</p>
            </div>
            <Dialog open={newGoalOpen} onOpenChange={setNewGoalOpen}>
              <DialogTrigger asChild>
                <Button className="mt-4 md:mt-0">
                  <Plus className="mr-2 h-4 w-4" />
                  New Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a new savings goal</DialogTitle>
                  <DialogDescription>Define what you're saving for and set a target amount.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Goal Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., New Laptop"
                      value={newGoal.title}
                      onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your savings goal"
                      value={newGoal.description}
                      onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="target">Target Amount (USD)</Label>
                    <Input
                      id="target"
                      type="number"
                      placeholder="1000"
                      value={newGoal.target}
                      onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="deadline">Target Date</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={newGoal.deadline}
                      onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setNewGoalOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateGoal}>Create Goal</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Saved</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalSaved.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">of ${totalTarget.toFixed(2)} total target</p>
                <Progress className="mt-2" value={overallProgress} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{goals.length}</div>
                <p className="text-xs text-muted-foreground">Across all your savings targets</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Aptos Balance</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{walletData.aptos.balance} APT</div>
                <p className="text-xs text-muted-foreground">
                  {walletData.aptos.connected ? "Wallet connected" : "Not connected"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Stellar Balance</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{walletData.stellar.balance} XLM</div>
                <p className="text-xs text-muted-foreground">
                  {walletData.stellar.connected ? "Wallet connected" : "Not connected"}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-7">
            <Card className="md:col-span-4">
              <CardHeader>
                <CardTitle>Savings Progress</CardTitle>
                <CardDescription>Your savings growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                <DashboardChart />
              </CardContent>
            </Card>
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle>Your Goals</CardTitle>
                <CardDescription>Track individual goal progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{goal.title}</div>
                          <div className="text-xs text-muted-foreground">{goal.description}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">${goal.current.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">of ${goal.target.toFixed(2)}</div>
                        </div>
                      </div>
                      <Progress value={(goal.current / goal.target) * 100} />
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/goal/1">View All Goals</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
