"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Coins, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"

export default function Register() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Basic form validation
    if (!name.trim()) {
      setError("Please enter your name")
      return
    }

    if (!email.trim()) {
      setError("Please enter your email")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      // Create user account with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        email, 
        password
      )
      
      const user = userCredential.user
      
      try {
        // Store additional user data in Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name,
          email,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        })
        console.log("User registered successfully:", user.uid)
      } catch (firestoreErr: any) {
        console.error("Firestore error:", firestoreErr)
        // Even if Firestore fails, we can still proceed if auth succeeded
        console.warn("Created auth account but failed to save user data to Firestore")
      }
      
      // Redirect to dashboard after successful authentication
      // (even if Firestore update failed)
      router.push("/dashboard")
    } catch (err: any) {
      // Handle specific Firebase Auth errors with user-friendly messages
      if (err.code === 'auth/email-already-in-use') {
        setError("This email is already registered. Please try logging in instead.")
      } else if (err.code === 'auth/invalid-email') {
        setError("Please enter a valid email address.")
      } else if (err.code === 'auth/weak-password') {
        setError("Password is too weak. Please choose a stronger password.")
      } else if (err.message && err.message.includes("permission-denied")) {
        setError("Database permission error. Please contact the administrator.")
        console.error("Firestore permissions error:", err)
      } else {
        setError("Failed to create an account. Please try again.")
        console.error("Registration error:", err)
      }
    } finally {
      setIsLoading(false)
    }
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
            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-muted-foreground">Enter your information to get started</p>
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
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
              <Label htmlFor="password">Password</Label>
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
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}