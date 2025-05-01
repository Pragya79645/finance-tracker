"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Coins, LogOut, Mail, Save, SettingsIcon, Shield, User, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function Settings() {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "/placeholder.svg?height=128&width=128",
  })

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [successMessage, setSuccessMessage] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault()

    // Update user profile
    setUser({
      ...user,
      name: formData.name,
      email: formData.email,
    })

    setSuccessMessage("Profile updated successfully")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      alert("New passwords do not match")
      return
    }

    // Reset password fields
    setFormData({
      ...formData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    })

    setSuccessMessage("Password updated successfully")
    setTimeout(() => setSuccessMessage(""), 3000)
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
            <Link href="/donate" className="text-sm font-medium hover:text-primary">
              Donations
            </Link>
            <Link href="/settings" className="text-sm font-medium text-primary">
              Settings
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
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
                    <SettingsIcon className="h-4 w-4" />
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
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground ml-2">Manage your account settings</p>
          </div>

          {successMessage && (
            <Alert className="bg-green-50 border-green-200">
              <Save className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">{successMessage}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 md:grid-cols-[200px_1fr]">
            <Card className="md:row-span-2">
              <CardHeader>
                <CardTitle>Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col space-y-1">
                  <Link href="/settings" className="text-sm font-medium text-primary">
                    Profile
                  </Link>
                  <Link href="/wallets" className="text-sm font-medium hover:text-primary">
                    Wallets
                  </Link>
                  <Link href="/settings?tab=security" className="text-sm font-medium hover:text-primary">
                    Security
                  </Link>
                  <Link href="/settings?tab=notifications" className="text-sm font-medium hover:text-primary">
                    Notifications
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="profile" className="flex-1">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Manage your profile information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex flex-col items-center gap-4">
                          <Avatar className="h-24 w-24">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback>JD</AvatarFallback>
                          </Avatar>
                          <Button variant="outline" size="sm">
                            Change Avatar
                          </Button>
                        </div>
                        <div className="flex-1 space-y-4">
                          <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                      </div>
                      <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security</CardTitle>
                    <CardDescription>Manage your account security settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordUpdate} className="space-y-6">
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input
                            id="currentPassword"
                            name="currentPassword"
                            type="password"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <Button type="submit">
                        <Shield className="mr-2 h-4 w-4" />
                        Update Password
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>Add an extra layer of security to your account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Two-Factor Authentication</div>
                          <div className="text-sm text-muted-foreground">Protect your account with 2FA</div>
                        </div>
                        <Button variant="outline">Enable</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Manage how you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Email Notifications</div>
                          <div className="text-sm text-muted-foreground">
                            Receive updates about your goals and donations
                          </div>
                        </div>
                        <Button variant="outline">
                          <Mail className="mr-2 h-4 w-4" />
                          Configure
                        </Button>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Goal Reminders</div>
                          <div className="text-sm text-muted-foreground">
                            Get reminders about upcoming goal deadlines
                          </div>
                        </div>
                        <Button variant="outline">
                          <Mail className="mr-2 h-4 w-4" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
