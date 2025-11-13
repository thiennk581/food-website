import { apiClient } from "@/lib/api-client"
import type { TagResponse } from "./tags"

export type UserBiasResponse = {
  id?: number | string
  score?: number
  tag?: TagResponse
  user?: {
    id?: number | string
  }
}

export async function fetchUserBiases(token: string) {
  return apiClient.get<UserBiasResponse[]>("/bias", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
