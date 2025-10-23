package com.example.foodie.controllers;

import com.example.foodie.dtos.BiasDTO;
import com.example.foodie.models.Bias;
import com.example.foodie.services.interfaces.BiasService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/bias")
@AllArgsConstructor
public class BiasController {
    private BiasService biasService;

    @PostMapping
    public ResponseEntity<?> addBias(@Valid @RequestBody BiasDTO biasDTO){
        try {
            Bias newBias = biasService.addBias(biasDTO);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(newBias);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }

    @PutMapping
    public ResponseEntity<?> updateBias(@Valid @RequestBody BiasDTO biasDTO){
        try{
            Bias updatedBias = biasService.updateBias(biasDTO);

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(updatedBias);

        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        }
    }
}
