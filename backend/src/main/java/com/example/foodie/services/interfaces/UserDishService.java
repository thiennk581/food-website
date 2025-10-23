package com.example.foodie.services.interfaces;


import com.example.foodie.dtos.UserDishDTO;
import com.example.foodie.models.UserDish;

import java.util.List;

public interface UserDishService {
    public List<UserDish> getAllUserDishes();
    public List<UserDish> getAllUserDishesByUserId(Integer userId);
    public UserDish addUserDish(UserDishDTO userDishDTO);
    public void deleteUserDishById(Integer userDishId);
    UserDish updateQuantity(Integer userDishId, Integer quantity);
}
