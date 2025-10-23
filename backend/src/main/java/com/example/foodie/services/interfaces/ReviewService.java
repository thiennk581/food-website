package com.example.foodie.services.interfaces;

import com.example.foodie.models.Review;

import java.util.List;
import java.util.Optional;

public interface ReviewService {
    List<Review> findAllReviewsByDishId(Integer dishId);
    Review addReview(Integer orderDishId, Review review);
}
