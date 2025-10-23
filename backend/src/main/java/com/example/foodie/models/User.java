package com.example.foodie.models;

import com.example.foodie.dtos.UserDTO;
import com.example.foodie.enums.Gender;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull(message="Tên không được để trống")
    private String fullName;

    @JsonFormat(pattern="dd-MM-yyyy")
    @Past(message = "Ngày sinh phải trong quá khứ")
    private LocalDate birthday;

    @NotNull(message="Giới tính không được để trống")
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @NotNull(message="Số điện thoại không được để trống")
    @Column(unique=true)
    @Pattern(
            regexp = "^(0|\\+84)(\\d{9})$",
            message = "Số điện thoại không hợp lệ (phải bắt đầu bằng 0 hoặc +84 và có 10 số)"
    )
    private String phoneNumber;

    @NotNull(message="Email không được để trống")
    @Column(unique=true)
    @Email(message="Email sai định dạng")
    private String email;

    @NotNull(message="Mật khẩu không được để trống")
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    private String password;

    @NotNull
    @ManyToOne
    @JoinColumn(name="role_id", referencedColumnName="id")
    private Role role;

    @OneToMany(mappedBy="user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Bias> biases;

    @OneToMany(mappedBy="user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<UserDish> userDishes;

    @Column(updatable=false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy="user", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Address> addresses;


    // PrePersist đánh dấu một method sẽ được gọi tự động ngay khi entity này (User) được thêm thêm vào DB
    // tức sẽ tự động thêm ngày tạo tài khoảng ngay khi User mới được thêm vào DB
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @NotNull
    @Builder.Default
    private boolean isActive = true;

    public static User createUserFromDTO(UserDTO userDTO, Role role){
        return User.builder()
                .fullName(userDTO.getFullName())
                .email(userDTO.getEmail())
                .phoneNumber(userDTO.getPhoneNumber())
                .password(userDTO.getPassword())
                .gender(userDTO.getGender())
                .birthday(userDTO.getBirthday())
                .role(role)
                .build();
    }
}

// Giải thích cho @Builder.Default
/*
Mặc dù bạn viết = true, nhưng builder không gọi setter cho isActive → giá trị false (0 trong MySQL) được persist
@Builder do Lombok tạo ra chỉ set những field bạn khai trong builder, các field khác sẽ giữ giá trị default của Java object
Với boolean isActive mặc định trong Java object chưa set → là false
Khi JPA persist → MySQL lưu 0

Dùng @Builder.Default → Lombok sẽ dùng giá trị default khi builder không set giá trị
 */