package com.example.foodie.services.impl;

import com.example.foodie.models.Restaurant;
import com.example.foodie.repos.RestaurantRepository;
import com.example.foodie.services.interfaces.RestaurantService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {
    private final RestaurantRepository restaurantRepository;

    @Override
    public List<Restaurant> getAllRestaurants(){

        List<Restaurant> restaurants = restaurantRepository.findAll();
        if (restaurants.isEmpty()){
            throw new RuntimeException("Không có nhà hàng nào");
        }else{
            return restaurants;
        }
    }

    @Override
    public Restaurant createRestaurant(Restaurant restaurant){

        Restaurant newRestaurant = Restaurant.builder()
                .name(restaurant.getName())
                .address(restaurant.getAddress())
                .phoneNumber(restaurant.getPhoneNumber())
                .build();

        return restaurantRepository.save(newRestaurant);
    }
}
