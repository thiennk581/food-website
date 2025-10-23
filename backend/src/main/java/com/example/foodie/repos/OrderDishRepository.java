package com.example.foodie.repos;

import com.example.foodie.models.OrderDish;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrderDishRepository extends JpaRepository<OrderDish, Integer> {
    Optional<OrderDish> findByDish_Id(Integer dishId);
}
