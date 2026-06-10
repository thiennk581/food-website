import { useState, useEffect, useCallback } from "react"
import { Promotion } from "@/types"
import { fetchPromotions } from "@/services/promotions"

export function usePromotions() {
  const [data, setData] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetchPromotions()
      setData(res)
      setError(null)
    } catch (err: any) {
      setError(err.message || "Lỗi tải dữ liệu khuyến mãi")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  return { data, loading, error, refresh: loadData }
}
