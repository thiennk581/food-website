package com.example.foodie.controllers;

import com.example.foodie.dtos.OrderDTO;
import com.example.foodie.models.Address;
import com.example.foodie.models.Order;
import com.example.foodie.services.interfaces.AddressService;
import com.example.foodie.services.interfaces.OrderService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/orders")
public class OrderController extends BaseController<Order>{
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        super(orderService);
        this.orderService = orderService;
    }

    @PostMapping("/{user_id}")
    public ResponseEntity<?> createOrder(@PathVariable(name="user_id") Integer userId,@Valid @RequestBody OrderDTO orderDTO){
        try {
            Order newOrder = orderService.createOrder(userId, orderDTO.getAddressId(), orderDTO.getSelectedDishes());

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(newOrder);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
}
