"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Coins, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      // Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      )
      
      const user = userCredential.user

      try {
        // Update last login timestamp in Firestore
        const userDocRef = doc(db, "users", user.uid)
        const userDoc = await getDoc(userDocRef)
        
        if (userDoc.exists()) {
          await updateDoc(userDocRef, {
            lastLogin: new Date().toISOString()
          })
        }
      } catch (firestoreErr) {
        // Even if updating last login fails, we can still proceed
        console.warn("Login successful but failed to update last login time:", firestoreErr)
      }

      console.log("User logged in successfully:", user.uid)
      
      // Redirect to dashboard after successful login
      router.push("/dashboard")
    } catch (err: any) {
      // Handle specific Firebase Auth errors with user-friendly messages
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError("Invalid email or password. Please try again.")
      } else if (err.code === 'auth/invalid-email') {
        setError("Please enter a valid email address.")
      } else if (err.code === 'auth/too-many-requests') {
        setError("Too many failed login attempts. Please try again later or reset your password.")
      } else if (err.code === 'auth/user-disabled') {
        setError("This account has been disabled. Please contact support.")
      } else {
        setError("Failed to log in. Please check your credentials and try again.")
        console.error("Login error:", err)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = () => {
    if (!email) {
      setError("Please enter your email address first.")
      return
    }
    
    // You can implement password reset functionality here
    // For now, let's just redirect to a hypothetical reset page
    router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8">
        <Link href="/" className="mb-8 flex items-center gap-2">
          <Coins className="h-6 w-6 text-primary" />
          <span className="text-2xl font-bold">CryptoSave</span>
        </Link>
        <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-sm">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground">Enter your credentials to access your account</p>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
          </form>
          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}