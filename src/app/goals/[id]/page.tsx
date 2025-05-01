"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { use } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  Calendar,
  Coins,
  DollarSign,
  Edit2,
  LogOut,
  Save,
  Settings,
  Share2,
  Target,
  Trash2,
  User,
  Wallet,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { GoalChart } from "@/components/goal-chart"

// Mock data for a single goal
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
    transactions: [
      { id: "1", date: "2023-06-15", amount: 500, type: "deposit", source: "Aptos Wallet" },
      { id: "2", date: "2023-07-01", amount: 300, type: "deposit", source: "Aptos Wallet" },
      { id: "3", date: "2023-07-15", amount: 200, type: "deposit", source: "Aptos Wallet" },
      { id: "4", date: "2023-08-01", amount: 100, type: "donation", source: "Stellar Wallet" },
      { id: "5", date: "2023-08-15", amount: 100, type: "deposit", source: "Aptos Wallet" },
    ],
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
    transactions: [
      { id: "1", date: "2023-07-01", amount: 500, type: "deposit", source: "Aptos Wallet" },
      { id: "2", date: "2023-07-15", amount: 500, type: "deposit", source: "Aptos Wallet" },
      { id: "3", date: "2023-08-01", amount: 500, type: "deposit", source: "Aptos Wallet" },
      { id: "4", date: "2023-08-15", amount: 250, type: "donation", source: "Stellar Wallet" },
    ],
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
    transactions: [
      { id: "1", date: "2023-05-10", amount: 1000, type: "deposit", source: "Aptos Wallet" },
      { id: "2", date: "2023-06-10", amount: 1000, type: "deposit", source: "Aptos Wallet" },
      { id: "3", date: "2023-07-10", amount: 1000, type: "deposit", source: "Aptos Wallet" },
      { id: "4", date: "2023-08-10", amount: 1000, type: "deposit", source: "Aptos Wallet" },
    ],
  },
]

export default function GoalDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = use(params)
  const [goal, setGoal] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedGoal, setEditedGoal] = useState<any>({})
  const [depositOpen, setDepositOpen] = useState(false)
  const [depositAmount, setDepositAmount] = useState("")
  const [shareOpen, setShareOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)

  useEffect(() => {
    if (id) {
      // In a real app, this would fetch from Firebase
      const foundGoal = mockGoals.find((g) => g.id === id)
      if (foundGoal) {
        setGoal(foundGoal)
        setEditedGoal({
          title: foundGoal.title,
          description: foundGoal.description,
          target: foundGoal.target,
          deadline: foundGoal.deadline,
        })
      }
    }
  }, [id])

  const handleSaveEdit = () => {
    setGoal({
      ...goal,
      title: editedGoal.title,
      description: editedGoal.description,
      target: Number.parseFloat(editedGoal.target),
      deadline: editedGoal.deadline,
    })
    setIsEditing(false)
  }

  const handleDeposit = () => {
    const amount = Number.parseFloat(depositAmount)
    if (isNaN(amount) || amount <= 0) return

    const newTransaction = {
      id: (goal.transactions.length + 1).toString(),
      date: new Date().toISOString().split("T")[0],
      amount,
      type: "deposit",
      source: "Aptos Wallet",
    }

    setGoal({
      ...goal,
      current: goal.current + amount,
      transactions: [...goal.transactions, newTransaction],
    })

    setDepositOpen(false)
    setDepositAmount("")
  }

  const handleDelete = () => {
    // In a real app, this would delete from Firebase
    router.push("/dashboard")
  }

  if (!goal) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading goal details...</h2>
        </div>
      </div>
    )
  }

  const progress = (goal.current / goal.target) * 100
  const remaining = goal.target - goal.current
  const isCompleted = goal.current >= goal.target

  // Calculate days remaining until deadline
  const today = new Date()
  const deadlineDate = new Date(goal.deadline)
  const daysRemaining = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Dashboard</span>
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">
              {isEditing ? (
                <Input
                  value={editedGoal.title}
                  onChange={(e) => setEditedGoal({ ...editedGoal, title: e.target.value })}
                  className="max-w-md"
                />
              ) : (
                goal.title
              )}
            </h1>
            {!isEditing && (
              <div className="ml-auto flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Dialog open={shareOpen} onOpenChange={setShareOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Share your savings goal</DialogTitle>
                      <DialogDescription>
                        Share your goal with friends and family to receive donations.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label>Donation Link</Label>
                        <div className="flex gap-2">
                          <Input readOnly value={`https://cryptosave.app/donate/${goal.id}`} />
                          <Button
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(`https://cryptosave.app/donate/${goal.id}`)
                            }}
                          >
                            Copy
                          </Button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Goal</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this goal? This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDeleteOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleDelete}>
                        Delete Goal
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
            {isEditing && (
              <div className="ml-auto flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveEdit}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Goal Progress</CardTitle>
                <CardDescription>
                  {isEditing ? (
                    <Textarea
                      value={editedGoal.description}
                      onChange={(e) => setEditedGoal({ ...editedGoal, description: e.target.value })}
                      className="mt-2"
                    />
                  ) : (
                    goal.description
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isCompleted && (
                  <Alert className="bg-green-50 border-green-200">
                    <Target className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-600">Goal Completed!</AlertTitle>
                    <AlertDescription className="text-green-600">
                      Congratulations! You've reached your savings target.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-medium">{progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${goal.current.toFixed(2)} saved</span>
                    <span>${goal.target.toFixed(2)} target</span>
                  </div>
                </div>

                <GoalChart transactions={goal.transactions} />

                <Dialog open={depositOpen} onOpenChange={setDepositOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <DollarSign className="mr-2 h-4 w-4" />
                      Add Funds
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Funds to Goal</DialogTitle>
                      <DialogDescription>Deposit funds from your Aptos wallet to this savings goal.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="amount">Amount (USD)</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="100"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDepositOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleDeposit}>Deposit</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Goal Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Target Amount</span>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editedGoal.target}
                        onChange={(e) => setEditedGoal({ ...editedGoal, target: e.target.value })}
                        className="w-32 h-8 text-right"
                      />
                    ) : (
                      <span className="text-sm font-medium">${goal.target.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Current Amount</span>
                    <span className="text-sm font-medium">${goal.current.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Remaining</span>
                    <span className="text-sm font-medium">${remaining.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Target Date
                    </span>
                    {isEditing ? (
                      <Input
                        type="date"
                        value={editedGoal.deadline}
                        onChange={(e) => setEditedGoal({ ...editedGoal, deadline: e.target.value })}
                        className="w-40 h-8"
                      />
                    ) : (
                      <span className="text-sm font-medium">{new Date(goal.deadline).toLocaleDateString()}</span>
                    )}
                  </div>
                  {!isEditing && daysRemaining > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Days Remaining</span>
                      <span className="text-sm font-medium">{daysRemaining} days</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Created On</span>
                    <span className="text-sm font-medium">{new Date(goal.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {goal.transactions
                      .slice(-5)
                      .reverse()
                      .map((transaction: any) => (
                        <div key={transaction.id} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">${transaction.amount.toFixed(2)}</div>
                            <div className="text-xs text-muted-foreground">
                              {transaction.type === "deposit" ? "Deposit" : "Donation"} from {transaction.source}
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(transaction.date).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
