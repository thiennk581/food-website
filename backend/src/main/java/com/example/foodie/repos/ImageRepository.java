package com.example.foodie.repos;

import com.example.foodie.models.Image;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Integer> {
    List<Image> findByDish_Id(Integer dishId);
}
