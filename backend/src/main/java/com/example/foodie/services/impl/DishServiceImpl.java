package com.example.foodie.services.impl;

import com.example.foodie.models.Dish;
import com.example.foodie.models.Tag;
import com.example.foodie.repos.DishRepository;
import com.example.foodie.services.interfaces.DishService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class DishServiceImpl implements DishService {

    private DishRepository dishRepository;

    @Override
    public List<Dish> getAllDishes(){
        List<Dish> dishes = dishRepository.findAll();

        if(dishes.isEmpty()){
            throw new RuntimeException("Không có món nào");
        }else{
            return dishes;
        }
    }

    @Override
    public Dish createDish(Dish dish){
        Dish newDish = Dish.builder()
                .name(dish.getName())
                .price(dish.getPrice())
                .restaurant(dish.getRestaurant())
                .build();

        return dishRepository.save(newDish);
    }
}
