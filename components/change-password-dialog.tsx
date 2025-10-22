"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface ChangePasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChangePasswordDialog({ open, onOpenChange }: ChangePasswordDialogProps) {
  const { toast } = useToast()
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    const { oldPassword, newPassword, confirmPassword } = passwords
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ các trường.",
      })
      return
    }
    if (newPassword !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Mật khẩu mới không khớp.",
      })
      return
    }
    // TODO: Add actual password change logic here
    toast({
      title: "Thành công",
      description: "Mật khẩu của bạn đã được thay đổi.",
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Đổi mật khẩu</DialogTitle>
          <DialogDescription>
            Để bảo mật, vui lòng không chia sẻ mật khẩu cho người khác.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="oldPassword">Mật khẩu cũ</Label>
            <Input id="oldPassword" name="oldPassword" type="password" onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <Input id="newPassword" name="newPassword" type="password" onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" onChange={handleChange} />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Hủy
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleSave}>
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}