"use client"

import { useState, useEffect } from "react"
import type { Cart, Dish } from "@/types"

const CART_KEY = "food_ordering_cart"

export function useCart() {
  const [cart, setCart] = useState<Cart>({ items: [], restaurantId: "" })

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_KEY)
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  const saveCart = (newCart: Cart) => {
    setCart(newCart)
    localStorage.setItem(CART_KEY, JSON.stringify(newCart))
  }

  const addToCart = (dish: Dish, quantity = 1, note?: string) => {
    const newCart = { ...cart }

    // If cart has items from different restaurant, clear it
    if (newCart.restaurantId && newCart.restaurantId !== dish.restaurantId) {
      newCart.items = []
    }

    newCart.restaurantId = dish.restaurantId

    const existingItem = newCart.items.find((item) => item.dish.id === dish.id)

    if (existingItem) {
      existingItem.quantity += quantity
      if (note) existingItem.note = note
    } else {
      newCart.items.push({ dish, quantity, note })
    }

    saveCart(newCart)
  }

  const updateQuantity = (dishId: string, quantity: number) => {
    const newCart = { ...cart }
    const item = newCart.items.find((item) => item.dish.id === dishId)

    if (item) {
      if (quantity <= 0) {
        newCart.items = newCart.items.filter((item) => item.dish.id !== dishId)
      } else {
        item.quantity = quantity
      }
    }

    if (newCart.items.length === 0) {
      newCart.restaurantId = ""
    }

    saveCart(newCart)
  }

  const removeFromCart = (dishId: string) => {
    const newCart = { ...cart }
    newCart.items = newCart.items.filter((item) => item.dish.id !== dishId)

    if (newCart.items.length === 0) {
      newCart.restaurantId = ""
    }

    saveCart(newCart)
  }

  const clearCart = () => {
    saveCart({ items: [], restaurantId: "" })
  }

  const getTotalAmount = () => {
    return cart.items.reduce((total, item) => total + item.dish.price * item.quantity, 0)
  }

  const getTotalItems = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0)
  }

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getTotalAmount,
    getTotalItems,
  }
}
