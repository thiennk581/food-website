package com.example.foodie.dtos;

import com.example.foodie.models.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AdminDTO extends UserDTO {

    @NotNull
    private Role role;
}
