package com.example.foodie.models;

import com.example.foodie.enums.RoleName;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull(message="Role không được để trống")
    @Column(unique=true)
    @Enumerated(EnumType.STRING)
    private RoleName roleName;

    @OneToMany(mappedBy="role", cascade=CascadeType.ALL)
    @JsonIgnore
    private List<User> users;

    public Role(RoleName roleName){
        this.roleName = roleName;
    }
}
