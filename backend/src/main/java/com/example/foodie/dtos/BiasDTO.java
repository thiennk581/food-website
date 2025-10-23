package com.example.foodie.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BiasDTO {
    @NotNull(message = "user id không được trống")
    private Integer userId;

    @NotNull(message = "tag id không được trống")
    private Integer tagId;

    @NotNull(message = "score không được trống")
    @Min(value = 1, message = "score phải >= 1")
    @Max(value = 5, message = "score phải <= 5")
    private Integer score;
}
