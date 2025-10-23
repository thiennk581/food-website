package com.example.foodie.repos;

import com.example.foodie.models.OrderDish;
import com.example.foodie.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    /* Vì bảng Review không trỏ với bảng Dish, nên nếu muốn lấy tất cả review của một dish,
     phải khai báo Query như dưới */
    @Query("SELECT review FROM Review review WHERE review.orderDish.dish.id = :dishId")
    List<Review> findAllByDishId(@Param("dishId") Integer dishId);
    boolean existsByOrderDish(OrderDish orderDish);
}
