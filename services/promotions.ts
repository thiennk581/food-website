import { apiClient } from "@/lib/api-client"
import { Promotion } from "@/types"

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {}
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchPromotions(): Promise<Promotion[]> {
  const headers = getAuthHeaders()
  return await apiClient.get<Promotion[]>("/promotions", { headers })
}

export async function createPromotion(data: Partial<Promotion>): Promise<Promotion> {
  const headers = getAuthHeaders()
  return await apiClient.post<Promotion>("/promotions", data, { headers })
}

export async function updatePromotion(id: string, data: Partial<Promotion>): Promise<Promotion> {
  const headers = getAuthHeaders()
  return await apiClient.put<Promotion>(`/promotions/${id}`, data, { headers })
}

export async function deletePromotion(id: string): Promise<void> {
  const headers = getAuthHeaders()
  return await apiClient.delete<void>(`/promotions/${id}`, { headers })
}

export async function validatePromotion(code: string, orderValue: number): Promise<Promotion> {
  const headers = getAuthHeaders()
  return await apiClient.get<Promotion>(`/promotions/validate?code=${encodeURIComponent(code)}&orderValue=${orderValue}`, { headers })
}
