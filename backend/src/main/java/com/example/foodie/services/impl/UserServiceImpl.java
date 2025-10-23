package com.example.foodie.services.impl;
import com.example.foodie.dtos.*;
import com.example.foodie.enums.RoleName;
import com.example.foodie.models.Role;
import com.example.foodie.models.User;
import com.example.foodie.repos.RoleRepository;
import com.example.foodie.repos.UserRepository;
import com.example.foodie.services.interfaces.UserService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;


@Service
@AllArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public UserResponseDTO register(UserDTO userDTO){
        if(userRepository.existsByEmail(userDTO.getEmail())){
            throw new RuntimeException("Email đã tồn tại");
        }
        else if(existsByPhoneNumber(userDTO.getPhoneNumber())){
            throw new RuntimeException("Sdt đã tồn tại");
        }

        Role role = roleRepository.findByRoleName(RoleName.USER)
                .orElseThrow(() -> new RuntimeException("Role USER không tồn tại trong database"));

        User user = User.createUserFromDTO(userDTO, role);
        userRepository.save(user);

        return UserResponseDTO.createUserResponseFromDTO(userDTO);
    }

    @Override
    public AdminResponseDTO registerAdmin(AdminDTO adminDTO){
        if (userRepository.existsByEmail(adminDTO.getEmail())){
            throw new RuntimeException("Email đã tồn tại");
        }

        Role role = roleRepository.findByRoleName(RoleName.ADMIN)
                .orElseThrow(() -> new RuntimeException("Role ADMIN không tồn tại"));


        User admin = User.createUserFromDTO(adminDTO, role);
        userRepository.save(admin);

        return AdminResponseDTO.createAdminResponseFromDTO(adminDTO);
    }

    @Override
    public UserLoginResponseDTO login(UserLoginDTO userLoginDTO){
        User user = userRepository.findByEmail(userLoginDTO.getEmail())
                .orElseThrow(() -> new RuntimeException("Email hoặc password không đúng"));

        if (user.getPassword().equals(userLoginDTO.getPassword())){
            return UserLoginResponseDTO.builder()
                    .email(user.getEmail())
                    .roleName(user.getRole().getRoleName())
                    .build();
        }
        else {
            throw new RuntimeException("Email hoặc password không đúng");
        }
    }


    // Dưới này là những hàm của lớp Repository
    /* Controller không nên gọi trực tiếp Repo, nhưng phải sử dụng các hàm bên dưới, vì vậy phải khai
       báo ở lớp Service để Controller có thể gọi
    */

    @Override
    public UserResponseDTO getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        return UserResponseDTO.builder()
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .gender(user.getGender())
                .birthday(user.getBirthday())
                .build();
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean existsByPhoneNumber(String phoneNumber) {
        return userRepository.existsByPhoneNumber(phoneNumber);
    }

}