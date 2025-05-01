"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, ChevronRight, Coins, Copy, ExternalLink, LogOut, Settings, User, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"



// Mock wallet data
const walletData = {
  aptos: {
    connected: true,
    address: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
    balance: 250,
    transactions: [
      { id: "1", date: "2023-08-15", amount: 100, type: "deposit", destination: "New Laptop" },
      { id: "2", date: "2023-08-01", amount: 50, type: "deposit", destination: "Vacation" },
      { id: "3", date: "2023-07-15", amount: 100, type: "deposit", destination: "New Laptop" },
    ],
  },
  stellar: {
    connected: true,
    address: "GABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    balance: 500,
    transactions: [
      { id: "1", date: "2023-08-10", amount: 100, type: "receive", source: "External" },
      { id: "2", date: "2023-07-25", amount: 200, type: "receive", source: "External" },
      { id: "3", date: "2023-07-10", amount: 200, type: "receive", source: "External" },
    ],
  },
}

export default function Wallets() {
  const [wallets, setWallets] = useState(walletData)
  const [copied, setCopied] = useState({ aptos: false, stellar: false })
  const [activeTab, setActiveTab] = useState("aptos")

  const handleCopyAddress = (wallet: "aptos" | "stellar") => {
    navigator.clipboard.writeText(wallets[wallet].address)
    setCopied({ ...copied, [wallet]: true })
    setTimeout(() => {
      setCopied({ ...copied, [wallet]: false })
    }, 2000)
  }

  const handleConnectWallet = (wallet: "aptos" | "stellar") => {
    // In a real app, this would connect to the actual wallet
    setWallets({
      ...wallets,
      [wallet]: {
        ...wallets[wallet],
        connected: true,
      },
    })
  }

  const handleDisconnectWallet = (wallet: "aptos" | "stellar") => {
    // In a real app, this would disconnect from the actual wallet
    setWallets({
      ...wallets,
      [wallet]: {
        ...wallets[wallet],
        connected: false,
      },
    })
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
            <Link href="/wallets" className="text-sm font-medium text-primary">
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
            <h1 className="text-2xl font-bold tracking-tight">Wallets</h1>
            <p className="text-muted-foreground ml-2">Connect and manage your crypto wallets</p>
          </div>

          <Tabs defaultValue="aptos" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="aptos">Aptos Wallet</TabsTrigger>
              <TabsTrigger value="stellar">Stellar Wallet</TabsTrigger>
            </TabsList>

            <TabsContent value="aptos" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wallet className="mr-2 h-5 w-5" />
                    Aptos Wallet
                  </CardTitle>
                  <CardDescription>
                    Connect your Aptos wallet to deposit funds toward your savings goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {wallets.aptos.connected ? (
                    <div className="space-y-4">
                      <Alert>
                        <Check className="h-4 w-4 text-green-600" />
                        <AlertDescription>Your Aptos wallet is connected and ready to use</AlertDescription>
                      </Alert>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Wallet Address</div>
                        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                          <code className="text-xs truncate flex-1">{wallets.aptos.address}</code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleCopyAddress("aptos")}
                          >
                            {copied.aptos ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                            <span className="sr-only">Copy address</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <a
                              href={`https://explorer.aptoslabs.com/account/${wallets.aptos.address}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">View on explorer</span>
                            </a>
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Balance</div>
                        <div className="text-2xl font-bold">{wallets.aptos.balance} APT</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Alert>
                        <AlertDescription>Connect your Aptos wallet to start saving toward your goals</AlertDescription>
                      </Alert>
                      <div className="flex justify-center">
                        <Button onClick={() => handleConnectWallet("aptos")}>Connect Aptos Wallet</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
                {wallets.aptos.connected && (
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => handleDisconnectWallet("aptos")}>
                      Disconnect
                    </Button>
                    <Button asChild>
                      <Link href="/dashboard">
                        Add Funds to Goal
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                )}
              </Card>

              {wallets.aptos.connected && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your recent Aptos wallet transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {wallets.aptos.transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{transaction.amount} APT</div>
                            <div className="text-xs text-muted-foreground">
                              {transaction.type === "deposit" ? "Deposit to" : "Received from"}{" "}
                              {transaction.destination}
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
              )}
            </TabsContent>

            <TabsContent value="stellar" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Wallet className="mr-2 h-5 w-5" />
                    Stellar Wallet
                  </CardTitle>
                  <CardDescription>
                    Connect your Stellar wallet to receive donations for your savings goals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {wallets.stellar.connected ? (
                    <div className="space-y-4">
                      <Alert>
                        <Check className="h-4 w-4 text-green-600" />
                        <AlertDescription>
                          Your Stellar wallet is connected and ready to receive donations
                        </AlertDescription>
                      </Alert>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Wallet Address</div>
                        <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                          <code className="text-xs truncate flex-1">{wallets.stellar.address}</code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleCopyAddress("stellar")}
                          >
                            {copied.stellar ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                            <span className="sr-only">Copy address</span>
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <a
                              href={`https://stellar.expert/explorer/testnet/account/${wallets.stellar.address}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">View on explorer</span>
                            </a>
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium">Balance</div>
                        <div className="text-2xl font-bold">{wallets.stellar.balance} XLM</div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Alert>
                        <AlertDescription>
                          Connect your Stellar wallet to receive donations for your goals
                        </AlertDescription>
                      </Alert>
                      <div className="flex justify-center">
                        <Button onClick={() => handleConnectWallet("stellar")}>Connect Stellar Wallet</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
                {wallets.stellar.connected && (
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={() => handleDisconnectWallet("stellar")}>
                      Disconnect
                    </Button>
                    <Button asChild>
                      <Link href="/donate">
                        View Donations
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                )}
              </Card>

              {wallets.stellar.connected && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Your recent Stellar wallet transactions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {wallets.stellar.transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{transaction.amount} XLM</div>
                            <div className="text-xs text-muted-foreground">
                              {transaction.type === "receive" ? "Received from" : "Sent to"} {transaction.source}
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
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
