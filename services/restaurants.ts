import { apiClient } from "@/lib/api-client";
import type { Restaurant } from "@/types";

// Map backend fields -> frontend Restaurant type
function mapRestaurant(r: any): Restaurant {
  return {
    id: String(r.id),
    name: r.name,
    address: r.address,
    phone: r.phoneNumber,
    isActive: Boolean(r.available),
  };
}

export async function fetchRestaurants(): Promise<Restaurant[]> {
  const data = await apiClient.get<any[]>("/restaurants");
  return data.map(mapRestaurant);
}

export type CreateRestaurantInput = {
  name: string;
  address: string;
  phone: string;
};

export async function createRestaurant(input: CreateRestaurantInput): Promise<Restaurant> {
  const payload = {
    name: input.name,
    address: input.address,
    phoneNumber: input.phone,
  };
  const data = await apiClient.post<any>("/restaurants", payload);
  return mapRestaurant(data);
}
