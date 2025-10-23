package com.example.foodie.services.interfaces;

import com.example.foodie.dtos.*;

public interface UserService {
    UserResponseDTO register(UserDTO userDTO);
    UserResponseDTO getUserByEmail(String email);
    AdminResponseDTO registerAdmin(AdminDTO adminDTO);

    UserLoginResponseDTO login(UserLoginDTO userLoginDTO);



    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
}
