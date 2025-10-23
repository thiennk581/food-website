package com.example.foodie.services.impl;

import com.example.foodie.dtos.UserDishDTO;
import com.example.foodie.models.*;
import com.example.foodie.repos.DishRepository;
import com.example.foodie.repos.UserDishRepository;
import com.example.foodie.repos.UserRepository;
import com.example.foodie.services.interfaces.UserDishService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserDishImpl implements UserDishService {
    private UserDishRepository userDishRepository;
    private UserRepository userRepository;
    private DishRepository dishRepository;

    @Override
    public List<UserDish> getAllUserDishes(){
        List<UserDish> userDishes = userDishRepository.findAll();

        if(userDishes.isEmpty()){
            throw new RuntimeException("Không tồn tại userDish nào");
        }else{
            return userDishes;
        }
    }

    @Override
    public List<UserDish> getAllUserDishesByUserId(Integer userId){
        List<UserDish> userDishes = userDishRepository.findAllByUser_Id(userId);

        if(userDishes.isEmpty()){
            throw new RuntimeException("Không tồn tại userDish nào");
        }else{
            return userDishes;
        }
    }

    @Override
    public UserDish addUserDish(UserDishDTO userDishDTO){
        boolean isUserDishExist = userDishRepository.existsByUser_IdAndDish_Id(
                userDishDTO.getUserId(),
                userDishDTO.getDishId()
        );

        if (isUserDishExist){
            throw new RuntimeException("UserDish đã tồn tại");
        }

        User user = userRepository.findById(userDishDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        Dish dish = dishRepository.findById(userDishDTO.getDishId())
                .orElseThrow(() -> new RuntimeException("Dish không tồn tại"));

        UserDish newUserDish = UserDish.builder()
                .user(user)
                .dish(dish)
                .quantity(userDishDTO.getQuantity())
                .build();

        return userDishRepository.save(newUserDish);
    }

    @Override
    public void deleteUserDishById(Integer userDishId){
        userDishRepository.deleteById(userDishId);
    }

    @Override
    public UserDish updateQuantity(Integer userDishId, Integer quantity){
        UserDish userDish = userDishRepository.findById(userDishId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy món trong giỏ"));

        userDish.setQuantity(quantity);

        return userDishRepository.save(userDish);
    }

}
