"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import useLogin from "@/hooks/authService/use-login"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, loading } = useLogin()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      const token = await login({ username: email, password })

      // Optionally decode token or fetch profile to decide role
      // For now, rely on backend cookie or a follow-up role check endpoint if available.

      // Keep compatibility with existing middleware by setting a lightweight cookie flag.
      document.cookie = `auth_token=true; path=/; max-age=86400`

      // Try to detect role quickly from a stored hint if backend set it in token (JWT) or via user info in localStorage.
      // If you have an endpoint like /auth/me, prefer calling it here to get role.
      let role: string | null = null
      try {
        const stored = localStorage.getItem("user_role")
        role = stored ? stored : null
      } catch {}

      if (role === "admin") {
        document.cookie = `user_role=admin; path=/; max-age=86400`
        router.push("/admin/dashboard")
        return
      }

      // Default route for normal users
      document.cookie = `user_role=user; path=/; max-age=86400`
      router.push("/user/food")
    } catch (err: any) {
      setError(err?.message || "Đăng nhập thất bại. Vui lòng thử lại.")
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Đăng nhập</CardTitle>
          <CardDescription>Nhập thông tin để đăng nhập vào tài khoản của bạn</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              <p className="font-medium">Demo accounts:</p>
              <p className="mt-1">User: user@example.com</p>
              <p>Admin: admin@example.com</p>
              <p className="mt-1">Password: password123</p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Chưa có tài khoản?{" "}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
