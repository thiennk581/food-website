"use client"

import { useEffect, useMemo, useState } from "react"
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
  const [page, setPage] = useState(1)
  const [quickFilter, setQuickFilter] = useState<"all"|"customers"|"admins"|"active"|"locked">("all")
  const pageSize = 10

  // Dữ liệu mock lấy từ module
  const mockUsers: User[] = usersFromMock

  const filteredUsers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return mockUsers.filter((user) => {
      const matchesQuery = !q || user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q)
      let matchesQuick = true
      switch (quickFilter) {
        case "customers":
          matchesQuick = user.role === "user"
          break
        case "admins":
          matchesQuick = user.role === "admin"
          break
        case "active":
          matchesQuick = user.isActive
          break
        case "locked":
          matchesQuick = !user.isActive
          break
        default:
          matchesQuick = true
      }
      return matchesQuery && matchesQuick
    })
  }, [searchQuery, quickFilter])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize))
  // Đảm bảo trang hợp lệ khi dữ liệu lọc thay đổi
  if (page > totalPages) {
    // eslint-disable-next-line no-console
    // console.debug('Adjust page due to filter change', { page, totalPages })
    // Soft sync back to last page
  }
  const pagedUsers = useMemo(() => {
    const safePage = Math.min(Math.max(1, page), totalPages)
    const start = (safePage - 1) * pageSize
    return filteredUsers.slice(start, start + pageSize)
  }, [filteredUsers, page, totalPages])

  // Reset về trang 1 mỗi khi điều kiện lọc thay đổi
  useEffect(() => {
    setPage(1)
  }, [quickFilter, searchQuery])

  // Nếu tổng số trang thay đổi và nhỏ hơn trang hiện tại, kéo về trang cuối hợp lệ
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [totalPages, page])

  const stats = useMemo(() => {
    const total = mockUsers.length
    const admins = mockUsers.filter((u) => u.role === "admin").length
    const actives = mockUsers.filter((u) => u.isActive).length
    const customers = mockUsers.filter((u) => u.role === "user").length
    const locked = mockUsers.filter((u) => !u.isActive).length
    return { total, admins, actives, customers, locked }
  }, [])

  const getDefaultAddress = (user: User) => {
    const list = user.address
    if (!list || list.length === 0) return "-"
    const def = list.find((a) => a.isDefault) || list[0]
    return def.address || "-"
  }

  return (
    <div className="space-y-8 px-18 py-10 bg-background flex-1">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h1>
          <p className="text-muted-foreground">Theo dõi tài khoản, vai trò và trạng thái hoạt động</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => { setSearchQuery(""); setQuickFilter("all"); setPage(1) }}>
            <RefreshCw className="mr-2 h-4 w-4" />Đặt lại
          </Button>
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />Thêm người dùng
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <button onClick={() => { setQuickFilter('all'); setPage(1) }}
          className={`rounded-xl  p-4 text-center transition-all hover:shadow-sm hover:-translate-y-[1px] ${quickFilter==='all' ? 'ring-3 ring-violet-400 bg-violet-100 text-violet-700' : 'border-violet-200 bg-violet-200/60 hover:bg-violet-100 text-violet-700'}`}>
          <div className="text-sm font-medium p-1">Tổng người dùng</div>
          <div className="text-3xl font-bold">{stats.total}</div>
        </button>
        <button onClick={() => { setQuickFilter('customers'); setPage(1) }}
          className={`rounded-xl  p-4 text-center transition-all hover:shadow-sm hover:-translate-y-[1px] ${quickFilter==='customers' ? 'ring-3 ring-amber-400 bg-amber-100 text-amber-700' : 'border-amber-200 bg-amber-200/60 hover:bg-amber-100 text-amber-700'}`}>
          <div className="text-sm font-medium p-1">Khách hàng</div>
          <div className="text-3xl font-bold">{stats.customers}</div>
        </button>
        <button onClick={() => { setQuickFilter('admins'); setPage(1) }}
          className={`rounded-xl py-4 p-4 text-center transition-all hover:shadow-sm hover:-translate-y-[1px] ${quickFilter==='admins' ? 'ring-3 ring-blue-400 bg-blue-100 text-blue-700' : 'border-blue-200 bg-blue-200/60 hover:bg-blue-100 text-blue-700'}`}>
          <div className="text-sm font-medium p-1">Quản trị viên</div>
          <div className="text-3xl font-bold">{stats.admins}</div>
        </button>
        <button onClick={() => { setQuickFilter('active'); setPage(1) }}
          className={`rounded-xl  p-4 text-center transition-all hover:shadow-sm hover:-translate-y-[1px] ${quickFilter==='active' ? 'ring-3 ring-emerald-400 bg-emerald-100 text-emerald-700' : 'border-emerald-200 bg-emerald-200/60 hover:bg-emerald-100 text-emerald-700'}`}>
          <div className="text-sm font-medium p-1">Đang hoạt động</div>
          <div className="text-3xl font-bold">{stats.actives}</div>
        </button>
        <button onClick={() => { setQuickFilter('locked'); setPage(1) }}
          className={`rounded-xl p-4 text-center transition-all hover:shadow-sm hover:-translate-y-[1px] ${quickFilter==='locked' ? 'ring-3 ring-rose-400 bg-rose-100 text-rose-700' : 'border-rose-200 bg-rose-200/60 hover:bg-rose-100 text-rose-700'}`}>
          <div className="text-sm font-medium p-1">Bị khóa</div>
          <div className="text-3xl font-bold">{stats.locked}</div>
        </button>
      </div>

      <Card className="border-muted/40 px-3">
        <CardHeader className="pb-0">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-semibold tracking-tight">Danh sách người dùng</CardTitle>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm tên hoặc email..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
                  className="pl-10 h-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto rounded-lg border">
            <Table className="[&_th]:py-4 [&_td]:py-3 [&_th]:px-6 [&_td]:px-6">
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
                  pagedUsers.map((user) => (
                  <TableRow className="hover:bg-muted/40" key={user.id}>
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
                                Khóa tài khoản
                              </>
                            ) : (
                              <>
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

      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Hiển thị {(filteredUsers.length === 0) ? 0 : (page - 1) * pageSize + 1}
          –{Math.min(page * pageSize, filteredUsers.length)} trong tổng {filteredUsers.length}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Trang trước
          </Button>
          <div className="text-sm tabular-nums">
            {page} / {totalPages}
          </div>
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            Trang sau
          </Button>
        </div>
      </div>
    </div>
  )
}
