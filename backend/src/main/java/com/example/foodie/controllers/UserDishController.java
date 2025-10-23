package com.example.foodie.controllers;

import com.example.foodie.dtos.UpdateDishQuantityDTO;
import com.example.foodie.dtos.UserDishDTO;
import com.example.foodie.models.UserDish;
import com.example.foodie.services.interfaces.UserDishService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/user-dishes")
@AllArgsConstructor
public class UserDishController {
    private UserDishService userDishService;

    @GetMapping
    public ResponseEntity<?> getAllUserDishes(){
        try{
            List<UserDish> userDishes = userDishService.getAllUserDishes();

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(userDishes);
        } catch(Exception e){
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> addUserDish(@Valid @RequestBody UserDishDTO userDishDTO){
        try {
            UserDish newUserDish = userDishService.addUserDish(userDishDTO);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(newUserDish);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @DeleteMapping
    public ResponseEntity<?> deleteById(@RequestBody Integer userDishId){
        try{
            userDishService.deleteUserDishById(userDishId);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .build();
        } catch(Exception e){
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @PutMapping
    public ResponseEntity<?> updateQuantity(@Valid @RequestBody UpdateDishQuantityDTO dto){
        try{
            userDishService.updateQuantity(dto.getUserDishId(), dto.getQuantity());

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .build();
        } catch(Exception e){
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
}
