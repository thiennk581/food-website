package com.example.foodie.services.interfaces;

import com.example.foodie.models.Dish;
import com.example.foodie.models.Tag;

import java.util.List;

public interface DishService {
    public List<Dish> getAllDishes();
    public Dish createDish(Dish dish);
}
