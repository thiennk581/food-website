package com.example.foodie.services.interfaces;

import com.example.foodie.models.Order;

import java.util.List;

public interface OrderService extends BaseService<Order>{
    public Order createOrder(Integer userId, Integer addressId, List<Integer> selectedDishes);
}
