package com.example.foodie.services.impl;

import com.example.foodie.models.OrderDish;
import com.example.foodie.models.Review;
import com.example.foodie.repos.DishRepository;
import com.example.foodie.repos.OrderDishRepository;
import com.example.foodie.repos.ReviewRepository;
import com.example.foodie.services.interfaces.ReviewService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@AllArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    private ReviewRepository reviewRepository;
    private DishRepository dishRepository;
    private OrderDishRepository orderDishRepository;

    @Override
    public List<Review> findAllReviewsByDishId(Integer dishId){
        dishRepository.findById(dishId)
                .orElseThrow(() -> new RuntimeException("Không tồn tại dish này"));

        return reviewRepository.findAllByDishId(dishId);
    }

    @Override
    public Review addReview(Integer orderDishId, Review review){
        OrderDish orderDish = orderDishRepository.findById(orderDishId)
                .orElseThrow(() -> new RuntimeException("order dish không tồn tại"));

        if (reviewRepository.existsByOrderDish(orderDish)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bạn đã review món này rồi");
        }

        Review newReview = Review.builder()
                .comment(review.getComment())
                .rating(review.getRating())
                .orderDish(orderDish)
                .build();

        return reviewRepository.save(newReview);
    }
}
