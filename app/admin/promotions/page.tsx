"use client"

import { useMemo, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreVertical, Plus, CheckCircle2 } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import type { Promotion } from "@/types"
import { usePromotions } from "@/hooks/promotions/use-promotions"
import { createPromotion, updatePromotion, deletePromotion } from "@/services/promotions"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const PromotionFormFields = ({ formObj }: { formObj: any }) => (
  <>
    <FormField
      control={formObj.control}
      name="code"
      rules={{ required: "Vui lòng nhập mã" }}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Mã khuyến mãi</FormLabel>
          <FormControl><Input placeholder="VD: SUMMER10" {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <FormField
      control={formObj.control}
      name="description"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Mô tả (tuỳ chọn)</FormLabel>
          <FormControl><Input placeholder="VD: Giảm giá mùa hè" {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={formObj.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Loại giảm giá</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger><SelectValue placeholder="Chọn loại" /></SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="PERCENTAGE">Theo phần trăm (%)</SelectItem>
                <SelectItem value="FIXED_AMOUNT">Số tiền cố định (VNĐ)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={formObj.control}
        name="value"
        rules={{ required: "Vui lòng nhập giá trị" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Giá trị giảm</FormLabel>
            <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={formObj.control}
        name="maxDiscountAmount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Giảm tối đa (VNĐ)</FormLabel>
            <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={formObj.control}
        name="minOrderValue"
        rules={{ required: "Vui lòng nhập đơn tối thiểu" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Đơn tối thiểu (VNĐ)</FormLabel>
            <FormControl><Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={formObj.control}
        name="startDate"
        rules={{ required: "Vui lòng chọn ngày bắt đầu" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ngày bắt đầu</FormLabel>
            <FormControl><Input type="datetime-local" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={formObj.control}
        name="endDate"
        rules={{ required: "Vui lòng chọn ngày kết thúc" }}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ngày kết thúc</FormLabel>
            <FormControl><Input type="datetime-local" {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={formObj.control}
        name="usageLimit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Giới hạn lượt dùng</FormLabel>
            <FormControl><Input type="number" placeholder="Bỏ trống để không giới hạn" {...field} onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} /></FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  </>
)

export default function PromotionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<Promotion | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data, loading, error, refresh } = usePromotions()
  const [promotions, setPromotions] = useState<Promotion[]>([])

  useEffect(() => {
    setPromotions(data || [])
  }, [data])

  type PromotionInput = {
    code: string
    description: string
    type: "PERCENTAGE" | "FIXED_AMOUNT"
    value: number
    maxDiscountAmount: number
    minOrderValue: number
    startDate: string
    endDate: string
    isActive: boolean
    usageLimit?: number
  }

  const form = useForm<PromotionInput>({
    defaultValues: {
      code: "",
      description: "",
      type: "PERCENTAGE",
      value: 0,
      maxDiscountAmount: 0,
      minOrderValue: 0,
      startDate: new Date().toISOString().slice(0, 16),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      isActive: true,
      usageLimit: undefined,
    },
    mode: "onTouched",
  })

  async function onSubmit(values: PromotionInput) {
    try {
      const formattedValues = {
        ...values,
        startDate: new Date(values.startDate).toISOString().slice(0, 19),
        endDate: new Date(values.endDate).toISOString().slice(0, 19),
        maxDiscountAmount: values.maxDiscountAmount || undefined,
        usageLimit: values.usageLimit || undefined,
      }
      const created = await createPromotion(formattedValues)
      setPromotions((prev) => [created, ...prev])
      setPage(1)
      toast({
        title: "Mã khuyến mãi đã được thêm thành công!",
      })
      setOpen(false)
      form.reset()
    } catch (e: any) {
      toast({ variant: "destructive", title: "Thêm thất bại", description: e.message || "Vui lòng thử lại sau." })
    }
  }

  const editForm = useForm<PromotionInput>({
    defaultValues: {
      code: "",
      description: "",
      type: "PERCENTAGE",
      value: 0,
      maxDiscountAmount: 0,
      minOrderValue: 0,
      startDate: "",
      endDate: "",
      isActive: true,
      usageLimit: undefined,
    },
    mode: "onTouched",
  })

  useEffect(() => {
    if (editing) {
      editForm.reset({
        code: editing.code,
        description: editing.description,
        type: editing.type,
        value: editing.value,
        maxDiscountAmount: editing.maxDiscountAmount || 0,
        minOrderValue: editing.minOrderValue,
        startDate: editing.startDate ? new Date(editing.startDate).toISOString().slice(0, 16) : "",
        endDate: editing.endDate ? new Date(editing.endDate).toISOString().slice(0, 16) : "",
        isActive: editing.isActive,
        usageLimit: editing.usageLimit || undefined,
      })
    }
  }, [editing, editForm])

  async function onEditSubmit(values: PromotionInput) {
    try {
      if (!editing) return
      const formattedValues = {
        ...values,
        startDate: new Date(values.startDate).toISOString().slice(0, 19),
        endDate: new Date(values.endDate).toISOString().slice(0, 19),
        maxDiscountAmount: values.maxDiscountAmount || undefined,
        usageLimit: values.usageLimit || undefined,
      }
      const updated = await updatePromotion(editing.id, formattedValues)
      setPromotions((prev) => prev.map((item) => item.id === editing.id ? updated : item))
      toast({
        title: "Đã cập nhật thành công!",
      })
      setEditOpen(false)
      setEditing(null)
    } catch (e: any) {
      toast({ variant: "destructive", title: "Cập nhật thất bại", description: e.message || "Vui lòng thử lại sau." })
    }
  }

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return promotions.filter((p) => {
      if (!q) return true
      return p?.code?.toLowerCase()?.includes(q) || p?.description?.toLowerCase()?.includes(q)
    })
  }, [searchQuery, promotions])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const paged = useMemo(() => {
    const safePage = Math.min(Math.max(1, page), totalPages)
    const start = (safePage - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page, totalPages])

  useEffect(() => { setPage(1) }, [searchQuery])
  useEffect(() => { if (page > totalPages) setPage(totalPages) }, [totalPages, page])

  return (
    <div className="space-y-8 px-20 py-10 bg-background flex-1">
      <div className="text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight pb-3">Quản lý Khuyến Mãi</h1>
        <div className="mx-auto mt-2 h-1 w-24 rounded bg-foreground/80" />
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm theo mã hoặc mô tả..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
              className="pl-10 h-10"
            />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />Thêm khuyến mãi
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Thêm mã khuyến mãi</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                  <PromotionFormFields formObj={form} />
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
                    <Button type="submit">Lưu</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="overflow-x-auto rounded-lg border">
          <Table className="[&_th]:py-4 [&_td]:py-3 [&_th]:px-6 [&_td]:px-6">
            <TableHeader>
              <TableRow>
                <TableHead>Mã KM</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Mức giảm</TableHead>
                <TableHead>Đơn tối thiểu</TableHead>
                <TableHead>Lượt dùng</TableHead>
                <TableHead>Thời gian</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">Đang tải...</TableCell>
                </TableRow>
              )}
              {error && !loading && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-destructive">Lỗi tải dữ liệu: {error}</TableCell>
                </TableRow>
              )}
              {(!loading && filtered.length === 0) ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">Không có mã khuyến mãi nào</TableCell>
                </TableRow>
              ) : (
                paged.map((p) => (
                  <TableRow className="hover:bg-muted/40" key={p.id}>
                    <TableCell className="font-semibold">{p.code}</TableCell>
                    <TableCell>{p.description}</TableCell>
                    <TableCell>
                      {p.type === "PERCENTAGE" ? `${p.value}%` : `${p.value.toLocaleString()} đ`}
                      {p.type === "PERCENTAGE" && p.maxDiscountAmount > 0 && <span className="block text-xs text-muted-foreground">Tối đa {p.maxDiscountAmount.toLocaleString()}đ</span>}
                    </TableCell>
                    <TableCell>{p.minOrderValue.toLocaleString()} đ</TableCell>
                    <TableCell>{p.currentUsage} / {p.usageLimit ? p.usageLimit : "∞"}</TableCell>
                    <TableCell className="text-xs">
                      {new Date(p.startDate).toLocaleDateString()} - {new Date(p.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {p.isActive && new Date(p.endDate) > new Date() ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">Đang chạy</span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700">Hết hạn/Tạm ngưng</span>
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
                          <DropdownMenuItem onClick={() => { setEditing(p); setEditOpen(true) }}>Chỉnh sửa</DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                                Xoá
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Xác nhận xoá mã {p.code}?</AlertDialogTitle>
                                <AlertDialogDescription>Mã khuyến mãi này sẽ bị xoá vĩnh viễn.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Hủy</AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-destructive hover:bg-destructive/90"
                                  onClick={async () => {
                                    try {
                                      await deletePromotion(p.id)
                                      setPromotions((prev) => prev.filter(item => item.id !== p.id))
                                      toast({ title: "Đã xoá mã khuyến mãi" })
                                    } catch (e) {
                                      toast({ variant: "destructive", title: "Xoá thất bại" })
                                    }
                                  }}
                                >Xác nhận xoá</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={(o) => { setEditOpen(o); if (!o) setEditing(null) }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa mã khuyến mãi</DialogTitle>
          </DialogHeader>
          <Form {...editForm}>
            <form className="space-y-4" onSubmit={editForm.handleSubmit(onEditSubmit)}>
              <PromotionFormFields formObj={editForm} />
              <div className="flex items-center gap-2">
                 <FormField
                    control={editForm.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <input type="checkbox" checked={field.value} onChange={field.onChange} className="h-4 w-4" />
                        </FormControl>
                        <FormLabel className="font-normal">Kích hoạt mã khuyến mãi</FormLabel>
                      </FormItem>
                    )}
                  />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>Hủy</Button>
                <Button type="submit">Lưu thay đổi</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
