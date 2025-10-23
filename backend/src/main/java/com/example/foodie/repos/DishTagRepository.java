package com.example.foodie.repos;

import com.example.foodie.models.Dish;
import com.example.foodie.models.DishTag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DishTagRepository extends JpaRepository<DishTag, Integer> {
    boolean existsByDish_IdAndTag_Id(int dishId, int tagId);
}
