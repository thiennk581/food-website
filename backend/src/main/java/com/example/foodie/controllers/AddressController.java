package com.example.foodie.controllers;

import com.example.foodie.models.Address;
import com.example.foodie.services.interfaces.AddressService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("${api.prefix}/address")
public class AddressController extends BaseController<Address> {
    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        super(addressService);
        this.addressService = addressService;
    }

    @PostMapping("/user/{user_id}")
    public ResponseEntity<?> addAddressByUserId(@PathVariable("user_id") Integer userId, @RequestBody Address address) {
        try {
            Address newAddress = addressService.addAddressByUserId(userId, address);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(newAddress);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @GetMapping("/user/{user_id}")
    public ResponseEntity<?> getAllAddressesByUserId(@PathVariable("user_id") Integer userId) {
        List<Address> allAddresses = addressService.getAllAddressesByUserId(userId);

        try{
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(allAddresses);

        } catch(RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
}
