package com.example.foodie.models;

import com.example.foodie.enums.Status;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "orders") // Cần phải làm vầy vì trong MySQl có từ khoá là Order, nếu không có dòng này thì sẽ bị trùng
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name="user_id")
    private User user;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.PENDING;

    @NotNull
    private Float totalPrice;

    @NotNull
    private String deliveryAddress;

    @OneToMany(mappedBy="order", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<OrderDish> orderDishes;


    @Column(updatable=false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}


