import { apiClient } from "@/lib/api-client"

export type UserAddressResponse = {
  id: number | string
  address: string
  isDefault: boolean
}

export async function fetchUserAddresses(token: string) {
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  }
  return apiClient.get<UserAddressResponse[]>("/address/user", { headers })
}

export async function deleteUserAddress(token: string, addressId: string | number) {
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  }
  return apiClient.delete<string>(`/address/user/${addressId}`, { headers })
}
