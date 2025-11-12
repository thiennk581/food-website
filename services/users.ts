import { apiClient } from "@/lib/api-client"

export type UserProfileResponse = {
  fullName?: string
  birthday?: string | null
  gender?: "MALE" | "FEMALE" | "OTHER"
  phoneNumber?: string
  email?: string
}

type FetchUserProfileOptions = {
  token?: string
}

export async function fetchUserProfile(options?: FetchUserProfileOptions) {
  const headers: HeadersInit = {}

  if (options?.token) {
    headers.Authorization = `Bearer ${options.token}`
  }

  return apiClient.get<UserProfileResponse>("/users/profiles", { headers })
}

export type UpdateUserProfilePayload = {
  fullName: string
  birthday?: string | null
  gender: "MALE" | "FEMALE" | "OTHER"
  phoneNumber: string
  email?: string
}

export async function updateUserProfile(
  payload: UpdateUserProfilePayload,
  options?: FetchUserProfileOptions,
) {
  const headers: HeadersInit = {}

  if (options?.token) {
    headers.Authorization = `Bearer ${options.token}`
  }

  return apiClient.put<UserProfileResponse>("/users/profiles", payload, { headers })
}
