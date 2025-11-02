"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreVertical, UserPlus, Lock, Unlock, Filter, RefreshCw, MapPin } from "lucide-react"
import type { User } from "@/types"
import { mockUsers as usersFromMock } from "@/lib/mock-data"
// Đã bỏ bộ lọc vai trò/trạng thái theo yêu cầu
// Bỏ avatar theo yêu cầu

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  // Bỏ filter, chỉ giữ search

  // Dữ liệu mock lấy từ module
  const mockUsers: User[] = usersFromMock

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return mockUsers.filter((user) => {
      const matchesQuery = !q || user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q)
      return matchesQuery
    })
  }, [searchQuery])

  const stats = useMemo(() => {
    const total = mockUsers.length
    const admins = mockUsers.filter((u) => u.role === "admin").length
    const actives = mockUsers.filter((u) => u.isActive).length
    return { total, admins, actives }
  }, [])

  const getDefaultAddress = (user: User) => {
    const list = user.address
    if (!list || list.length === 0) return "-"
    const def = list.find((a) => a.isDefault) || list[0]
    return def.address || "-"
  }

  return (
    <div className="space-y-6 px-15 py-10 bg-background flex-1">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h1>
          <p className="text-muted-foreground">Theo dõi tài khoản, vai trò và trạng thái hoạt động</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => { setSearchQuery("") }}>
            <RefreshCw className="mr-2 h-4 w-4" />Đặt lại
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />Thêm người dùng
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.actives}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Quản trị viên</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.admins}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-muted/40">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold tracking-tight">Danh sách người dùng</CardTitle>
              <p className="text-sm text-muted-foreground">Lọc theo vai trò, trạng thái hoặc tìm kiếm theo tên/email</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm tên hoặc email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[28%] min-w-[200px]">Tên user</TableHead>
                  <TableHead className="w-[24%] min-w-[220px]">Email</TableHead>
                  <TableHead className="w-[12%]">Vai trò</TableHead>
                  <TableHead className="w-[24%] min-w-[240px]">Địa chỉ</TableHead>
                  <TableHead className="w-[12%]">Trạng thái</TableHead>
                  <TableHead className="w-[8%] text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      Không có người dùng phù hợp với bộ lọc hiện tại
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <span className="text-sm sm:text-base font-semibold leading-tight">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[260px] text-muted-foreground">
                      <span className="block truncate" title={user.email}>{user.email}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={user.role === "admin" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" : "bg-amber-100 text-amber-700 hover:bg-amber-100"}>
                        {user.role === "admin" ? "Admin" : "User"}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0" />
                        <span className="truncate" title={getDefaultAddress(user)}>{getDefaultAddress(user)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.isActive ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">Hoạt động</span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200">Khóa</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                          <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                          <DropdownMenuItem>
                            {user.isActive ? (
                              <>
                                <Lock className="mr-2 h-4 w-4" />
                                Khóa tài khoản
                              </>
                            ) : (
                              <>
                                <Unlock className="mr-2 h-4 w-4" />
                                Mở khóa
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
