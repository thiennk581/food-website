package com.example.foodie.controllers;

import com.example.foodie.models.Dish;
import com.example.foodie.services.interfaces.DishService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/dishes")
@AllArgsConstructor
public class DishController {

    private DishService dishService;

    @GetMapping
    public ResponseEntity<?> getAllDishes(){

        try {
            List<Dish> dishes = dishService.getAllDishes();

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(dishes);
        }catch (Exception e){
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> createDish(@Valid @RequestBody Dish dish){

        try{
            Dish newDish = dishService.createDish(dish);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(newDish);
        }catch (Exception e){
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
}
